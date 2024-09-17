from http.server import BaseHTTPRequestHandler
from database import Database


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Connect to PostgreSQL database
        try:
            conn, cursor = Database.connect()

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
        finally:
            # Close the cursor and connection
            Database.disconnect(conn, cursor)
        return
