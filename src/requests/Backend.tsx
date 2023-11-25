import { useCookies } from "react-cookie";
import { api_uri } from "../misc";
import * as schema from "../../api/schema";


export async function CreateGame() {
    const result = await fetch(api_uri + '/create-game.tsx', {
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

export async function RetrievePlayers(game_id: number) {
    const result = await fetch(api_uri + '/retrieve-players.tsx', {
        method: "POST",
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ id: game_id })
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

async function RetrieveUser() {
    const [cookies, SetCookie] = useCookies(['user_id']);

    const result = await fetch(api_uri + '/retrieve-user.tsx', {
    method: "POST",
    headers: { 'Content-Type' : 'application/json' },
    body: JSON.stringify({ id: cookies.user_id })
    });
    if (result.ok) {
        const userData: schema.User = await result.json();
        console.log(userData);
        return userData;
    }
    else {
        throw new Error(`Failed to retrieve user data. body: {id: ${cookies.user_id}}`);
    }
}

async function UpdateGame(new_state: string) {
    const [cookies, SetCookie] = useCookies(['game_id']);
    const result = await fetch(api_uri + '/update-game.tsx', {
        method: "POST",
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ id: cookies.game_id, state: new_state })
    }); 
    if (result.ok) {
        const updatedGameData: schema.Game = await result.json();
        console.log(updatedGameData);
        return updatedGameData;
    }
    else {
        throw new Error(`Failed to update game state. body: {id: ${cookies.game_id}, state: ${new_state}`);
    }
}

export async function UpsertUser(email: string, access_token: string | undefined, refresh_token: string | undefined, spotify_user_id: string) {
    const result = await fetch(api_uri + '/upsert-user.tsx', {
        method: "PUT",
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ email: email, access_token: access_token, refresh_token: refresh_token, spotify_user_id: spotify_user_id })
    }); 
    if (result.ok) {
        const upsertedUserData: schema.User = await result.json();
        console.log(upsertedUserData);
        return upsertedUserData;
    }
    else {
        throw new Error(`Failed to upsert user. body: {email: ${email}, access_token: ${access_token}, refresh_token: ${refresh_token}, spotify_user_id: ${spotify_user_id}`);
    }
}

export async function UpsertPlayer(user_id: number, game_id: number, playlist_uri: string) {
    
    const result = await fetch(api_uri + '/upsert-player.tsx', {
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

async function UpsertGuess(guessed_player_id: number) {
    const [cookies, SetCookie] = useCookies(['user_id', 'game_id']);
    const result = await fetch(api_uri + '/upsert-guess.tsx', {
        method: "PUT",
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ game_id: cookies.game_id, user_id: cookies.user_id, guessed_player_id: guessed_player_id })
    }); 
    if (result.ok) {
        const updatedGameData: schema.Guess = await result.json();
        console.log(updatedGameData);
        return updatedGameData;
    }
    else {
        throw new Error(`Failed to upsert guess. body: {game_id: ${cookies.game_id}, user_id: ${cookies.user_id}, guessed_player_id: ${guessed_player_id}`);
    }
}