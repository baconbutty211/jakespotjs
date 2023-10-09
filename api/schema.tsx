import { Generated, Insertable, Selectable, Updateable } from 'kysely';

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
    spotify_access_token: string,
    spotify_refresh_token: string,
    spotify_user_id: string,
}
export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UpdateableUser = Updateable<UserTable>;

export interface PlayerTable {
    id: Generated<number>,
    user_id: number,
    game_id: number,
    spotify_playlist_id: string,
    score: number,
}
export type Player = Selectable<PlayerTable>;
export type NewPlayer = Insertable<PlayerTable>;
export type UpdateablePlayer = Updateable<PlayerTable>;


export interface SongTable {
    id: Generated<number>,
    spotify_track_id: string,
    player_id: Player["id"]
}
export type Song = Selectable<SongTable>;
export type NewSong = Insertable<SongTable>;
export type UpdateableSong = Updateable<SongTable>;


export interface GameTable {
    id: Generated<number>,
    state: "lobby" | "guessing" | "scoring" | "finished",
    current_song_id: Song["id"] | null
}
export type Game = Selectable<GameTable>;
export type NewGame = Insertable<GameTable>;
export type UpdateableGame = Updateable<GameTable>;


export interface GuessTable {
    id: Generated<number>,
    player_id: Player["id"],
    current_song_id: Song["id"],
    guessed_player_id: Player["id"],
    is_correct: boolean
}
export type Guess = Selectable<GuessTable>;
export type NewGuess = Insertable<GuessTable>;
export type UpdateableGuess = Updateable<GuessTable>;