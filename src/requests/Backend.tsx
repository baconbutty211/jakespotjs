import { useCookies } from "react-cookie";
import { api_uri } from "../misc";


export async function GetUser(user_id: number) {    
    const result = await fetch(api_uri + '/retrieve-user.tsx', {
      method: "POST",
      headers: { 'Content-Type' : 'application/json' },
      body: JSON.stringify({ id: user_id })
    });
    if (result.ok) {
        const user = await result.json()
        return user;
    }
    else {
      throw new Error('Failed to retrieve user data.')
    }
  }

export async function CreatePlayer(user_id: number, game_id: number, playlist_uri: string) {
    
    const result = await fetch(api_uri + '/create-player.tsx', {
        method: "POST",
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ user_id: user_id, game_id: game_id, spotify_playlist_id: playlist_uri })
    });
    if (result.ok) {
        const player = await result.json();
        return player;
    }
    else {
        throw new Error(`Failed to create new player. body: {user_id: ${user_id}, game_id: ${game_id}, playlist_uri: ${playlist_uri}}`);
    }
}