import json
from http.server import BaseHTTPRequestHandler
import logging
import psycopg2
import os
import requests
import random


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


def get_random_player(game_id: int):
    # Send SQL query to create a new game
    with get_connection() as conn:
        with conn.cursor() as cur:
            # Does player exist?
            cur.execute(
                """SELECT * FROM players 
                WHERE game_id = %(game_id)s
                ORDER BY RANDOM()
                LIMIT 1;
                """,
                {"game_id": game_id},
            )
            result = cur.fetchone()
    return {
        "id": result[0],
        "user_id": result[1],
        "game_id": result[2],
        "spotify_playlist_id": result[3],
        "score": result[4],
    }


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


def get_spotify_playlist(access_token, playlist_id):
    url = f"https://api.spotify.com/v1/playlists/{playlist_id}"
    headers = {"Authorization": f"Bearer {access_token}"}

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        return response.json()  # returns the playlist data in JSON format
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return None


def update_game(game_id: int, state: str, new_song_id: int = None):
    # Update the game record in the database
    with get_connection() as conn:
        with conn.cursor() as cur:
            if new_song_id == None:
                cur.execute(
                    """
                    UPDATE games
                    SET state = %(state)s
                    WHERE id = %(id)s
                    RETURNING *
                """,
                    {"id": game_id, "state": state},
                )
            else:
                cur.execute(
                    """
                    UPDATE games
                    SET state = %(state)s, current_song_id = %(new_song_id)s
                    WHERE id = %(id)s
                    RETURNING *
                """,
                    {"id": game_id, "state": state, "new_song_id": new_song_id},
                )
            result = cur.fetchone()
    print(f"Updated game to {result}")
    return {
        "id": result[0],
        "state": result[1],
        "current_song_id": result[2],
    }


def set_song(player_id: int, spotify_track_id: str):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO songs (spotify_track_id, player_id)
                VALUES (%(spotify_track_id)s, %(player_id)s)
                RETURNING *
            """,
                {"spotify_track_id": spotify_track_id, "player_id": player_id},
            )
            result = cur.fetchone()
    return {"id": result[0], "spotify_track_id": result[1], "player_id": result[2]}


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Parse the request body
            content_length = int(self.headers["Content-Length"])
            body = self.rfile.read(content_length)
            request_data = json.loads(body)

            print(request_data)

            # Extract data from request
            game_id: int = int(request_data.get("game_id"))
            state: str = request_data.get("state")

            if not game_id:
                raise ValueError("game id required.")

            # If the state is "scoring", score the players
            if state == "scoring":
                raise NotImplementedError("Not implemented scoring")
                guesses = database.find_latest_guesses_by_game_id(game_id)
                if not guesses:
                    raise ValueError(
                        "Attempted to score when no players have guessed. (Guesses[] empty)"
                    )

                logging.info(f"Guesses: {guesses}")
                for guess in guesses:
                    if guess["is_correct"]:
                        database.increment_player_score(guess["player_id"])

            # If the state is "guessing", set new current_song_id
            if state == "guessing":
                random_player = get_random_player(game_id)
                user_id = int(random_player["user_id"])
                spotify_playlist_id = random_player["spotify_playlist_id"]
                random_player_access_token = get_user_access_token(user_id)
                random_player_playlist = get_spotify_playlist(
                    random_player_access_token, spotify_playlist_id
                )
                # Select random spotify song id from the playlist json
                spotify_song_ids = []
                for song in random_player_playlist["tracks"]["items"]:
                    spotify_song_ids.append(song["track"]["id"])
                random_spotify_song_id = spotify_song_ids[
                    random.randint(0, len(spotify_song_ids))
                ]
                new_song = set_song(random_player["id"], random_spotify_song_id)
                updated_game = update_game(game_id, state, new_song["id"])
            else:
                updated_game = update_game(game_id, state)

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
