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
            logging.info("Upserting new user...")

            # Parse the request body
            content_length = int(self.headers["Content-Length"])
            body = self.rfile.read(content_length)
            request_data = json.loads(body)

            print(request_data)

            # Extract data from request
            access_token = request_data.get("access_token")
            refresh_token = request_data.get("refresh_token")
            spotify_user_id = request_data.get("spotify_user_id")

            # Send SQL query to create a new game
            with get_connection() as conn:
                with conn.cursor() as cur:
                    # Does player exist?
                    cur.execute(
                        """SELECT id FROM users WHERE spotify_user_id=%(spotify_user_id)s""",
                        {"spotify_user_id": spotify_user_id},
                    )
                    result = cur.fetchone()
                    print(
                        f"Selected user with spotify user id {spotify_user_id}: {result}"
                    )
                    if result:
                        cur.execute(
                            """
                            UPDATE users 
                            SET spotify_access_token=%(spotify_access_token)s, spotify_refresh_token=%(spotify_refresh_token)s
                            WHERE spotify_user_id=%(spotify_user_id)s
                            RETURNING *
                        """,
                            {
                                "spotify_user_id": spotify_user_id,
                                "spotify_access_token": access_token,
                                "spotify_refresh_token": refresh_token,
                            },
                        )
                    else:
                        cur.execute(
                            """
                            INSERT INTO users (email, spotify_access_token, spotify_refresh_token, spotify_user_id)
                            VALUES (%(email)s, %(spotify_access_token)s, %(spotify_refresh_token)s, %(spotify_user_id)s)
                            RETURNING *
                        """,
                            {
                                "spotify_user_id": spotify_user_id,
                                "spotify_access_token": access_token,
                                "spotify_refresh_token": refresh_token,
                                "email": "N/A",
                            },
                        )
                    result = cur.fetchone()
            print(f"Newly upserted user {result}")
            user = {
                "id": result[0],
                "spotify_access_token": result[2],
                "spotify_refresh_token": result[3],
                "spotify_user_id": result[4],
            }

            # Log game creation success
            logging.info(f"Upserted user with id: {user['id']}")

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
