import { GetApiUri } from "../misc";
import * as schema from "./Schema";

export async function CreateGame() {
    const uri = GetApiUri('create-game');
    const result = await fetch(uri, {
        method: "POST"
    }); 
    if (result.ok) {
        const newGameData: schema.Game = await result.json();
        return newGameData;
    }
    else {
        throw new Error("Failed to create new game.");
    }
}

export async function RetrieveGame(game_id: number) {
    const uri = GetApiUri('retrieve-game');
    const result = await fetch(uri, {
        method: "POST",
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ game_id: game_id })
    });
    if (result.ok) {
        const gameData: schema.Game = await result.json();
        return gameData;
    }
    else {
        throw new Error(`Failed to retrieve game. body: {id: ${game_id}}`);
    }
}

export async function RetrievePlayers(game_id: number) {
    const uri = GetApiUri('retrieve-players');
    const result = await fetch(uri, {
        method: "POST",
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ game_id: game_id })
    });
    if (result.ok) {
        const playersData: schema.Player[] = await result.json();
        playersData.forEach((player: schema.Player) => {
            //console.log(player);
        });
        return playersData;
    }
    else {
        throw new Error(`Failed to retrieve players. body: {id: ${game_id}}`);
    }
}

export async function RetrieveUser(user_id: number) {
    const uri = GetApiUri('retrieve-user');
    const result = await fetch(uri, {
    method: "POST",
    headers: { 'Content-Type' : 'application/json' },
    body: JSON.stringify({ user_id: user_id })
    });
    if (result.ok) {
        const userData: schema.User = await result.json();
        //console.log(userData);
        return userData;
    }
    else {
        throw new Error(`Failed to retrieve user data. body: {id: ${user_id}}`);
    }
}

export async function RetrieveSong(song_id: number) {
    const uri = GetApiUri('retrieve-song');
    const result = await fetch(uri, {
    method: "POST",
    headers: { 'Content-Type' : 'application/json' },
    body: JSON.stringify({ song_id: song_id })
    });
    if (result.ok) {
        const songData: schema.Song = await result.json();
        console.log(songData);
        return songData;
    }
    else {
        throw new Error(`Failed to retrieve song data. body: {song_id: ${song_id}}`);
    }
}

export async function UpdateGame(game_id: number, new_state: "lobby" | "guessing" | "scoring" | "finished") {
    const uri = GetApiUri('update-game');
    const result = await fetch(uri, {
        method: "POST",
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ game_id: game_id, state: new_state })
    }); 
    if (result.ok) {
        const updatedGameData: schema.Game = await result.json();
        //console.log(updatedGameData);
        return updatedGameData;
    }
    else {
        throw new Error(`Failed to update game state. body: {id: ${game_id}, state: ${new_state}`);
    }
}

export async function UpsertUser(email: string, access_token: string | undefined, refresh_token: string | undefined, spotify_user_id: string) {
    const uri = GetApiUri('upsert-user');
    const result = await fetch(uri, {
        method: "PUT",
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ email: email, access_token: access_token, refresh_token: refresh_token, spotify_user_id: spotify_user_id })
    }); 
    if (result.ok) {
        const upsertedUserData: schema.User = await result.json();
        //console.log(upsertedUserData);
        return upsertedUserData;
    }
    else {
        throw new Error(`Failed to upsert user. body: {email: ${email}, access_token: ${access_token}, refresh_token: ${refresh_token}, spotify_user_id: ${spotify_user_id}`);
    }
}

export async function UpsertPlayer(user_id: number, game_id: number, playlist_uri: string) {
    const uri = GetApiUri('upsert-player');
    const result = await fetch(uri, {
        method: "PUT",
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ user_id: user_id, game_id: game_id, spotify_playlist_id: playlist_uri })
    });
    if (result.ok) {
        const playerData: schema.Player = await result.json();
        return playerData;
    }
    else {
        throw new Error(`Failed to upsert player. body: {user_id: ${user_id}, game_id: ${game_id}, playlist_uri: ${playlist_uri}}`);
    }
}

export async function UpsertGuess(user_id: number, game_id: number, guessed_player_id: number) {
    
    const uri = GetApiUri('upsert-guess');
    const result = await fetch(uri, {
        method: "PUT",
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ game_id: game_id, user_id: user_id, guessed_player_id: guessed_player_id })
    }); 
    if (result.ok) {
        const updatedGuessData: schema.Guess = await result.json();
        //console.log(updatedGuessData);
        return updatedGuessData;
    }
    else {
        throw new Error(`Failed to upsert guess. body: {game_id: ${game_id}, user_id: ${user_id}, guessed_player_id: ${guessed_player_id}`);
    }
}

export async function UpsertSong(player_id: number, spotify_track_id: string) {
    const uri = GetApiUri('upsert-song');
    const result = await fetch(uri, {
        method: "PUT",
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ player_id: player_id, spotify_track_id: spotify_track_id })
    }); 
    if (result.ok) {
        const newSongData: schema.Song = await result.json();
        return newSongData;
    }
    else {
        throw new Error(`Failed to upsert song. body: {player_id: ${player_id}, spotify_track_id: ${spotify_track_id}`);
    }
}