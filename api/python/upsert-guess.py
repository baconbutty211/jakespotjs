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


def get_player(user_id: int, game_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """ SELECT *
                    FROM players
                    WHERE user_id = %(user_id)s AND game_id = %(game_id)s""",
                {"user_id": user_id, "game_id": game_id},
            )
            result = cur.fetchone()
    return {
        "id": result[0],
        "user_id": result[1],
        "game_id": result[2],
        "spotify_playlist_id": result[3],
        "score": result[4],
    }


def get_game(game_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT * FROM games
                WHERE id = %(game_id)s
            """,
                {"game_id": game_id},
            )
            result = cur.fetchone()
    print(f"Updated game to {result}")
    return {
        "id": result[0],
        "state": result[1],
        "current_song_id": result[2],
    }


def get_song(song_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """ SELECT *
                    FROM songs
                    WHERE id = %(song_id)s""",
                {"song_id": song_id},
            )
            result = cur.fetchone()
    return {
        "id": result[0],
        "spotify_track_id": result[1],
        "player_id": result[2],
    }


def guess_exists(player_id: int, current_song_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            # Does guess exist?
            cur.execute(
                """ SELECT id
                    FROM guesses
                    WHERE player_id = %(player_id)s AND current_song_id = %(current_song_id)s""",
                {"player_id": player_id, "current_song_id": current_song_id},
            )
            if cur.fetchone():
                return True
            else:
                return False


def insert_guess(
    player_id: int, guessed_player_id: int, is_correct: bool, current_song_id: int
):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """ 
                    INSERT INTO guesses (player_id, guessed_player_id, is_correct, current_song_id)
                    VALUES (%(player_id)s, %(guessed_player_id)s, %(is_correct)s, %(current_song_id)s)
                    RETURNING *
                """,
                {
                    "player_id": player_id,
                    "guessed_player_id": guessed_player_id,
                    "is_correct": is_correct,
                    "current_song_id": current_song_id,
                },
            )
            result = cur.fetchone()
    return {
        "id": result[0],
        "player_id": result[1],
        "guessed_player_id": result[2],
        "is_correct": result[3],
        "current_song_id": result[4],
    }


def update_guess(
    player_id: int, guessed_player_id: int, is_correct: bool, current_song_id: int
):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """ 
                    UPDATE guesses
                    SET guessed_player_id=%(guessed_player_id)s, is_correct=%(is_correct)s, current_song_id=%(current_song_id)s
                    WHERE player_id=%(player_id)s
                    RETURNING *
                """,
                {
                    "player_id": player_id,
                    "guessed_player_id": guessed_player_id,
                    "is_correct": is_correct,
                    "current_song_id": current_song_id,
                },
            )
            result = cur.fetchone()
    return {
        "id": result[0],
        "player_id": result[1],
        "guessed_player_id": result[2],
        "is_correct": result[3],
        "current_song_id": result[4],
    }


def check_all_players_guessed(game_id: int, current_song_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """ SELECT *
                    FROM players
                    WHERE game_id = %(game_id)s""",
                {"game_id": game_id},
            )
            players = cur.fetchmany()
            cur.execute(
                """ SELECT *
                    FROM guesses
                    WHERE current_song_id = %(current_song_id)s""",
                {"current_song_id": current_song_id},
            )
            guesses = cur.fetchmany()
    return len(guesses) == len(players)


def update_game(game_id: int, state: int = "scoring"):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """ 
                    UPDATE games
                    SET state=%(state)s
                    WHERE id=%(game_id)s
                    RETURNING *
                """,
                {"game_id": game_id, "state": state},
            )
            result = cur.fetchone()
    return {
        "id": result[0],
        "state": result[1],
        "current_song_id": result[2],
    }


def update_scores(game_id: int, current_song_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            # select ALL guesses for current song
            cur.execute(
                """ SELECT *
                    FROM guesses
                    WHERE current_song_id = %(current_song_id)s""",
                {"current_song_id": current_song_id},
            )
            results = cur.fetchmany()
            # Calculate scores
            for result in results:
                guess = {
                    "id": result[0],
                    "player_id": result[1],
                    "guessed_player_id": result[2],
                    "is_correct": result[3],
                    "current_song_id": result[4],
                }
                if bool(guess["is_correct"]):
                    # Increment score
                    cur.execute(
                        """ UPDATE players
                            SET score = score + 1
                            WHERE id = %(player_id)s""",
                        {"player_id": guess["player_id"]},
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
            guessed_player_id = request_data.get("guessed_player_id")

            # Send SQL query to create a new game
            player = get_player(user_id, game_id)
            game = get_game(game_id)
            current_song = get_song(game["current_song_id"])
            if guess_exists(player["id"], game["current_song_id"]):
                # Update guess
                guess = update_guess(
                    player["id"],
                    guessed_player_id,
                    guessed_player_id == current_song["player_id"],
                    game["current_song_id"],
                )
            else:
                # Insert guess
                guess = insert_guess(
                    player["id"],
                    guessed_player_id,
                    guessed_player_id == current_song["player_id"],
                    game["current_song_id"],
                )

            print(f"Upserted guess: {guess}")
            # Log game creation success
            logging.info(f"Upserted guess with id: {guess['id']}")

            if check_all_players_guessed(game_id, game["current_song_id"]):
                # Update game state to scoring
                update_game(game_id=game_id, state="scoring")
                update_scores(game_id, game["current_song_id"])

            # Prepare the response
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()

            # Send the response as JSON
            self.wfile.write(json.dumps(guess).encode("utf-8"))

        except Exception as error:
            logging.error(f"Error: {str(error)}")

            # Handle errors, respond with status 500 and error message
            self.send_response(500)
            self.send_header("Content-type", "application/json")
            self.end_headers()

            error_response = json.dumps({"error": str(error)})
            self.wfile.write(error_response.encode("utf-8"))
