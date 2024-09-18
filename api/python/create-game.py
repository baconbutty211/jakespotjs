import json
from http.server import BaseHTTPRequestHandler
import logging
import psycopg2  # type: ignore
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
            logging.info("Creating new game...")

            # Send SQL query to create a new game
            with get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        INSERT INTO games (state)
                        VALUES ('lobby')
                        RETURNING *
                    """
                    )
                    result = cur.fetchone()
            print(f"Newly created game {result}")
            new_game = {
                "id": result[0],
                "state": result[1],
                "current_song_id": result[2],
            }

            # Log game creation success
            logging.info(f"Created game with id: {new_game['id']}")

            # Prepare the response
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()

            # Send the response as JSON
            self.wfile.write(json.dumps(new_game).encode("utf-8"))

        except Exception as error:
            logging.error(f"Error: {str(error)}")

            # Handle errors, respond with status 500 and error message
            self.send_response(500)
            self.send_header("Content-type", "application/json")
            self.end_headers()

            error_response = json.dumps({"error": str(error)})
            self.wfile.write(error_response.encode("utf-8"))
