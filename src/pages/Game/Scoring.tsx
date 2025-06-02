import * as schema from "../../requests/Schema";
import * as api from "../../requests/Backend";
import Button from "../../components/Button";
import { GameScoringPlayerTable } from "../../components/PlayerTable";
import { MaxInt, Playlist, SpotifyApi, User } from "@spotify/web-api-ts-sdk";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";

interface Props {
    players: schema.Player[],
    user_id: number,
    game_id: number,
    player_id: number,
    host: boolean,
    spotify_access_token: string,
    final?: boolean,
  }
  

export default function Scoring({ players, user_id, game_id, player_id, host, spotify_access_token, final=false }: Props) {
    const { sdk: spotify_api } = useAuth();
    useEffect(() => {
        if(!final) {
            SetRandomSong(); // Select new song for the next round
        }
    }, []);

    async function SetRandomSong() {
        const player = players.find((player: schema.Player) => player.id === player_id); // Find the current player
        if (!player || !player.spotify_playlist_id) {
            console.error("Player or Spotify playlist ID not found.");
            return;
        }
        try {
            const tracks = await spotify_api.playlists.getPlaylistItems(player.spotify_playlist_id); // Fetch the first item to ensure the playlist exists
            console.log(tracks);
            const random_track = tracks.items[Math.floor(Math.random() * tracks.total)];
            await api.UpsertSong(player.id, random_track.track.id);
        } catch (error: any) {
            console.error('Error setting player random song:', error);
        }
    }

    return (<>
        <h3> Scoreboard </h3>
        <GameScoringPlayerTable players={players}/>
        <br/>
        
        { host && !final ? <Button onClick={handleContinue}>Continue playing</Button> : <></> }
        { host && !final ? <Button onClick={handleFinish}>Finished playing</Button> : <></> }
    </>)

    async function handleContinue() {
        api.UpdateGame(game_id, "guessing");
    }
    async function handleFinish() {
        api.UpdateGame(game_id, "finished");
    }
}