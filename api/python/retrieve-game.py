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
            # Log that the game creation process has started
            logging.info("Selecting game...")

            # Parse the request body
            content_length = int(self.headers["Content-Length"])
            body = self.rfile.read(content_length)
            request_data = json.loads(body)

            print(request_data)

            # Extract data from request
            game_id = request_data.get("game_id")

            # Send SQL query to create a new game
            with get_connection() as conn:
                with conn.cursor() as cur:
                    # Does player exist?
                    cur.execute(
                        """SELECT * FROM games WHERE id=%(game_id)s;""",
                        {"game_id": game_id},
                    )
                    result = cur.fetchone()

            print(f"Selected user {result}")
            game = {
                "id": result[0],
                "state": result[1],
                "current_song_id": result[2],
            }

            # Log game creation success
            logging.info(f"Selected user with id: {game['id']}")

            # Prepare the response
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()

            # Send the response as JSON
            self.wfile.write(json.dumps(game).encode("utf-8"))

        except Exception as error:
            logging.error(f"Error: {str(error)}")

            # Handle errors, respond with status 500 and error message
            self.send_response(500)
            self.send_header("Content-type", "application/json")
            self.end_headers()

            error_response = json.dumps({"error": str(error)})
            self.wfile.write(error_response.encode("utf-8"))
