import json
from http.server import BaseHTTPRequestHandler
import logging
import psycopg2
import os
import requests


def log(message: str):
    logging.info(message)
    print(message)


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


def player_exists(user_id: int, game_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            # Does guess exist?
            cur.execute(
                """SELECT id FROM players WHERE user_id=%(user_id)s AND game_id=%(game_id)s""",
                {"user_id": user_id, "game_id": game_id},
            )
            if cur.fetchone():
                return True
    return False


def get_user_access_token(user_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            # Does player exist?
            cur.execute(
                """SELECT * FROM users 
                WHERE id = %(user_id)s
                ORDER BY RANDOM()
                LIMIT 1;
                """,
                {"user_id": user_id},
            )
            result = cur.fetchone()
            user = {
                "id": result[0],
                "spotify_access_token": result[2],
                "spotify_refresh_token": result[3],
                "spotify_user_id": result[4],
            }
    return user["spotify_access_token"]


def get_spotify_user_details(access_token):
    url = f"https://api.spotify.com/v1/me"
    headers = {"Authorization": f"Bearer {access_token}"}

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        return response.json()  # returns the playlist data in JSON format
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return None


def update_player(user_id: int, game_id: int, spotify_playlist_id: str):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE players 
                SET spotify_playlist_id=%(spotify_playlist_id)s
                WHERE user_id=%(user_id)s AND game_id=%(game_id)s
                RETURNING *
            """,
                {
                    "user_id": user_id,
                    "game_id": game_id,
                    "spotify_playlist_id": spotify_playlist_id,
                },
            )
            result = cur.fetchone()
    return result


def insert_player(
    user_id: int, game_id: int, spotify_playlist_id: str, username: str, image: str
):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO players (user_id, game_id, spotify_playlist_id, username, image)
                VALUES (%(user_id)s, %(game_id)s, %(spotify_playlist_id)s, %(username)s, %(image)s)
                RETURNING *
            """,
                {
                    "user_id": user_id,
                    "game_id": game_id,
                    "spotify_playlist_id": spotify_playlist_id,
                    "username": username,
                    "image": image,
                },
            )
            result = cur.fetchone()
    return result


class handler(BaseHTTPRequestHandler):
    def do_PUT(self):
        try:
            # Log that the game creation process has started
            log("Upserting new player...")

            # Parse the request body
            content_length = int(self.headers["Content-Length"])
            body = self.rfile.read(content_length)
            request_data = json.loads(body)

            # Extract data from request
            user_id = int(request_data.get("user_id"))
            game_id = int(request_data.get("game_id"))
            spotify_playlist_id = request_data.get("spotify_playlist_id")

            # Send SQL query to create a new game
            with get_connection() as conn:
                with conn.cursor() as cur:
                    # Does player exist?
                    log("   Checking player exists...")
                    if player_exists(user_id, game_id):
                        log("       Updating player...")
                        result = update_player(user_id, game_id, spotify_playlist_id)
                    else:
                        # Get spotify user details
                        log(
                            "       Selecting access token from users database tables..."
                        )
                        spotify_access_token = get_user_access_token(user_id)
                        log("       Requesting Spotify user details...")
                        spotify_user_details = get_spotify_user_details(
                            spotify_access_token
                        )
                        username = spotify_user_details["display_name"]
                        image = spotify_user_details["images"][0]["url"]
                        log("       Inserting player...")
                        result = insert_player(
                            user_id, game_id, spotify_playlist_id, username, image
                        )

            print(f"Newly upserted player {result}")
            player = {
                "id": result[0],
                "user_id": result[1],
                "game_id": result[2],
                "spotify_playlist_id": result[3],
                "score": result[4],
                "username": result[5],
                "image": result[6],
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
