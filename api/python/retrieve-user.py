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
            logging.info("Selecting user...")

            # Parse the request body
            content_length = int(self.headers["Content-Length"])
            body = self.rfile.read(content_length)
            request_data = json.loads(body)

            print(request_data)

            # Extract data from request
            user_id = request_data.get("id")

            # Send SQL query to create a new game
            with get_connection() as conn:
                with conn.cursor() as cur:
                    # Does player exist?
                    cur.execute(
                        """SELECT * FROM users WHERE id=%(user_id)s;""",
                        {"user_id": user_id},
                    )
                    result = cur.fetchone()

            print(f"Selected user {result}")
            user = {
                "id": result[0],
                "spotify_access_token": result[2],
                "spotify_refresh_token": result[3],
                "spotify_user_id": result[4],
            }

            # Log game creation success
            logging.info(f"Selected user with id: {user['id']}")

            # Prepare the response
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()

            # Send the response as JSON
            self.wfile.write(json.dumps(user).encode("utf-8"))

        except Exception as error:
            logging.error(f"Error: {str(error)}")

            # Handle errors, respond with status 500 and error message
            self.send_response(500)
            self.send_header("Content-type", "application/json")
            self.end_headers()

            error_response = json.dumps({"error": str(error)})
            self.wfile.write(error_response.encode("utf-8"))
