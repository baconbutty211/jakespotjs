import { Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface Database {
    users: UserTable,
    players: PlayerTable,
    songs: SongTable,
    games: GameTable,
    guesses: GuessTable
}


export interface UserTable {
    id: Generated<number>,
    email: string,
    spotify_access_token: string | null,
    spotify_refresh_token: string | null,
}
export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UpdateableUser = Updateable<UserTable>;


export interface PlayerTable {
    id: Generated<number>,
    user_id: number,
    spotify_playlist_id: string,
    game_id: number,
    score: number,
}
export type Player = Selectable<PlayerTable>;
export type NewPlayer = Insertable<PlayerTable>;
export type UpdateablePlayer = Updateable<PlayerTable>;


export interface SongTable {
    id: Generated<number>,
    spotify_track_id: string,
    player_id: number
}
export type Song = Selectable<SongTable>;
export type NewSong = Insertable<SongTable>;
export type UpdateableSong = Updateable<SongTable>;


export interface GameTable {
    id: Generated<number>,
    state: "lobby" | "guessing" | "scoring" | "finished",
    current_song_id: number
}
export type Game = Selectable<GameTable>;
export type NewGame = Insertable<GameTable>;
export type UpdateableGame = Updateable<GameTable>;


export interface GuessTable {
    id: Generated<number>,
    player_id: number,
    guessed_player_id: number,
    is_correct: boolean
}
export type Guess = Selectable<GuessTable>;
export type NewGuess = Insertable<GuessTable>;
export type UpdateableGuess = Updateable<GuessTable>;