export type User = {
    id: number,
    email: string,
    spotify_access_token: string,
    spotify_refresh_token: string,
    spotify_user_id: string,
}

export type Player = {
    id: number,
    user_id: number,
    game_id: number,
    spotify_playlist_id: string,
    score: number,
    username: string,
    image: string,
}

export type Song = {
    id: number,
    spotify_track_id: string,
    player_id: Player["id"]
}


export type Game = {
    id: number,
    state: "lobby" | "guessing" | "scoring" | "finished",
    current_song_id: Song["id"] | null
}


export type Guess = {
    id: number,
    player_id: Player["id"],
    current_song_id: Song["id"],
    guessed_player_id: Player["id"],
    is_correct: boolean
}