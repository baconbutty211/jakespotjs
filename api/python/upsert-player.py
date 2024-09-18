import json
from http.server import BaseHTTPRequestHandler
import logging
import psycopg2
import os


def get_connection():
    _name = os.environ.get("POSTGRES_DATABASE")
    _user = os.environ.get("POSTGRES_USER")
    _password = os.environ.get("POSTGRES_PASSWORD")
    _host = os.environ.get("POSTGRES_HOST")

    return psycopg2.connect(
        dbname=_name,
        user=_user,
        password=_password,
        host=_host,
        port="5432",  # Default PostgreSQL port
    )


class handler(BaseHTTPRequestHandler):
    def do_PUT(self):
        try:
            # Log that the game creation process has started
            logging.info("Upserting new player...")

            # Parse the request body
            content_length = int(self.headers["Content-Length"])
            body = self.rfile.read(content_length)
            request_data = json.loads(body)

            print(request_data)

            # Extract data from request
            user_id = request_data.get("user_id")
            game_id = request_data.get("game_id")
            spotify_playlist_id = request_data.get("spotify_playlist_id")

            # Send SQL query to create a new game
            with get_connection() as conn:
                with conn.cursor() as cur:
                    # Does player exist?
                    cur.execute(
                        """SELECT id FROM players WHERE user_id=%(user_id)s AND game_id=%(game_id)s""",
                        {"user_id": user_id, "game_id": game_id},
                    )
                    result = cur.fetchone()

                    if result:
                        cur.execute(
                            """
                            UPDATE players 
                            SET user_id=%(user_id)s, game_id=%(game_id)s, spotify_playlist_id=%(spotify_playlist_id)s
                            WHERE id=%(player_id)s
                            RETURNING *
                        """,
                            {
                                "player_id": result[0],
                                "user_id": user_id,
                                "game_id": game_id,
                                "spotify_playlist_id": spotify_playlist_id,
                            },
                        )
                    else:
                        cur.execute(
                            """
                            INSERT INTO players (user_id, game_id, spotify_playlist_id)
                            VALUES (%(user_id)s, %(game_id)s, %(spotify_playlist_id)s)
                            RETURNING *
                        """,
                            {
                                "user_id": user_id,
                                "game_id": game_id,
                                "spotify_playlist_id": spotify_playlist_id,
                            },
                        )
                    result = cur.fetchone()
            print(f"Newly upserted player {result}")
            player = {
                "id": result[0],
                "user_id": result[1],
                "game_id": result[2],
                "spotify_playlist_id": result[3],
                "score": result[4],
            }

            # Log game creation success
            logging.info(f"Upserted player with id: {player['id']}")

            # Prepare the response
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()

            # Send the response as JSON
            self.wfile.write(json.dumps(player).encode("utf-8"))

        except Exception as error:
            logging.error(f"Error: {str(error)}")

            # Handle errors, respond with status 500 and error message
            self.send_response(500)
            self.send_header("Content-type", "application/json")
            self.end_headers()

            error_response = json.dumps({"error": str(error)})
            self.wfile.write(error_response.encode("utf-8"))
