from http.server import BaseHTTPRequestHandler
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
    def do_GET(self):
        # Connect to PostgreSQL database
        try:
            with get_connection() as conn:
                with conn.cursor() as cursor:
                    # Execute SQL commands
                    cursor.execute("SELECT * FROM games;")

                    # Fetch results (for SELECT queries)
                    rows = cursor.fetchall()
                    for row in rows:
                        print(row)

                    # Commit changes (for INSERT/UPDATE/DELETE queries)
                    conn.commit()

            self.send_response(200)
            self.send_header("Content-type", "text/plain")
            self.end_headers()
            self.wfile.write(f"Successfully read from database!".encode("utf-8"))

        except Exception as error:
            print(f"Error: {error}")

            self.send_response(500)
            self.send_header("Content-type", "text/plain")
            self.end_headers()
            self.wfile.write(f"Failed to read from database".encode("utf-8"))
        return
