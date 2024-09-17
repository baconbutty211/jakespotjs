class User:
    def __init__(
        self,
        id: int,
        spotify_access_token: str,
        spotify_refresh_token: str,
        spotify_user_id: str,
    ):
        self.id = id
        self.spotify_access_token = spotify_access_token
        self.spotify_refresh_token = spotify_refresh_token
        self.spotify_user_id = spotify_user_id


class Player:
    def __init__(
        self, id: int, user_id: int, game_id: int, spotify_playlist_id: str, score: int
    ):
        self.id = id
        self.user_id = user_id
        self.game_id = game_id
        self.spotify_playlist_id = spotify_playlist_id
        self.score = score


class Song:
    def __init__(self, id: int, spotify_track_id: str, player_id: int):
        self.id = id
        self.spotify_track_id = spotify_track_id
        self.player_id = player_id


class Game:
    def __init__(self, id: int, state: str, current_song_id: int = None):
        if state not in {"lobby", "guessing", "scoring", "finished"}:
            raise ValueError("Invalid state value")
        self.id = id
        self.state = state
        self.current_song_id = current_song_id


class Guess:
    def __init__(
        self,
        id: int,
        player_id: int,
        current_song_id: int,
        guessed_player_id: int,
        is_correct: bool,
    ):
        self.id = id
        self.player_id = player_id
        self.current_song_id = current_song_id
        self.guessed_player_id = guessed_player_id
        self.is_correct = is_correct
