import * as schema from "../../requests/Schema";
import * as api from "../../requests/Backend";
import Button from "../../components/Button";
import { useEffect, useState } from "react";
import SpotifyPlayer from 'react-spotify-web-playback';
import { GameGuessingPlayerTable } from "../../components/PlayerTable";

interface Props {
    players: schema.Player[],
    user_id: number,
    game_id: number,
    host?: boolean,
    access_token?: string,
  }
  

export default function Guessing({ players, user_id, game_id, host, access_token }: Props) {
    const [spotifyAccessToken, setSpotifyAccessToken] = useState<string>('Initial access token');
    const [currentTrackId, setCurrentTrackId] = useState<string>();
    const [selectedPlayerId, setSelectedPlayerId] = useState<number>();

    useEffect(() => {
        fetchUser();
        fetchCurrentTrack();
    }, []);

    async function fetchUser() {
        try {
            const user = await api.RetrieveUser(user_id);
            setSpotifyAccessToken(user.spotify_access_token);
        } catch (error: any) {
            console.error('Error fetching current track:', error);
        }
    }
    async function fetchCurrentTrack() {
        try {
            const game = await api.RetrieveGame(game_id);
            if (!game.current_song_id) {
                console.error('No current song ID found in the game.');
                return;
            }
            const currentSong = await api.RetrieveSong(game.current_song_id);
            setCurrentTrackId(currentSong.spotify_track_id);
        } catch (error: any) {
            console.error('Error fetching current track:', error);
        }
    }

    return (<>
        <h2>Guessing</h2>
        <GameGuessingPlayerTable players={players} 
            selectedPlayerId={selectedPlayerId ? selectedPlayerId : -1} 
            onGuessCallback={handleGuess}
        />
        {currentTrackId == null ? 
            <p>Loading song...</p> :
            <SpotifyPlayer token={spotifyAccessToken} uris={[`spotify:track:${currentTrackId}`]} 
            initialVolume={0.05}
            styles={{
                activeColor: '#fff',
                bgColor: '#333',
                color: '#fff',
                loaderColor: '#fff',
                sliderColor: '#1cb954',
                trackArtistColor: '#ccc',
                trackNameColor: '#fff',
            }}/>
        }
        <br/>
    </>);

    async function handleGuess(guessed_player_id: number) {
        await api.UpsertGuess(
            user_id,
            game_id,
            guessed_player_id
        );
        setSelectedPlayerId(guessed_player_id);
    }
}