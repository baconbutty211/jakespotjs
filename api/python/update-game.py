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
    def do_POST(self):
        try:
            # Parse the request body
            content_length = int(self.headers["Content-Length"])
            body = self.rfile.read(content_length)
            request_data = json.loads(body)

            print(request_data)

            # Extract data from request
            id = request_data.get("id")
            state = request_data.get("state")
            new_song_id = request_data.get("new_song_id")

            if not id:
                raise ValueError("id required.")
            if not state and not new_song_id:
                raise ValueError("state or new song id required.")

            # If the state is "scoring", score the players
            if state == "scoring":
                raise NotImplementedError("Not implemented scoring")
                guesses = database.find_latest_guesses_by_game_id(id)
                if not guesses:
                    raise ValueError(
                        "Attempted to score when no players have guessed. (Guesses[] empty)"
                    )

                logging.info(f"Guesses: {guesses}")
                for guess in guesses:
                    if guess["is_correct"]:
                        database.increment_player_score(guess["player_id"])

            # Update the game record in the database
            with get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        UPDATE games
                        SET state = %(state)s, current_song_id = %(new_song_id)s
                        WHERE id = %(id)s
                        RETURNING *
                    """,
                        {"id": id, "state": state, "new_song_id": new_song_id},
                    )
                    result = cur.fetchone()
            print(f"Newly created game {result}")
            updated_game = {
                "id": result[0],
                "state": result[1],
                "current_song_id": result[2],
            }

            # Log the updated game record
            logging.info(updated_game)

            # Return the updated game as JSON response
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(updated_game).encode("utf-8"))

        except Exception as error:
            logging.error(f"Error: {str(error)}")

            # Handle errors, respond with status 500 and error message
            self.send_response(500)
            self.send_header("Content-type", "application/json")
            self.end_headers()

            error_response = json.dumps({"error": str(error)})
            self.wfile.write(error_response.encode("utf-8"))
