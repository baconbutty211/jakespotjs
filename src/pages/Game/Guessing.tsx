import * as schema from "../../../api/node/schema";
import * as api from "../../requests/Backend";
import Button from "../../components/Button";
import { useEffect, useState } from "react";
import SpotifyPlayer from 'react-spotify-web-playback';

interface Props {
    players: schema.Player[],
    cookies: {
        user_id?: string,
        game_id?: string,
        host?: boolean,
        access_token?: string,
    }
  }
  

export default function Guessing({ players, cookies }: Props) {
    const [selectedPlayerId, setSelectedPlayerId] = useState<number>();
    const [currentTrackId, setCurrentTrackId] = useState<string>();

    useEffect(() => {
        fetchCurrentTrackId();
    }, []);

    async function fetchCurrentTrackId() {
        try {
            const currentSong = await api.RetrieveCurrentSong(parseInt(cookies.game_id ? cookies.game_id : "No game id cookie"));
            setCurrentTrackId(currentSong['spotify_track_id']);
        } catch (error: any) {
            console.error('Error fetching current track:', error);
        }
    }

    return (<>
        <h2>Guessing</h2>
        <table>
            <thead> 
                <tr>
                    <th> Player </th>
                    <th> Guess </th>
                </tr>
            </thead>
            <tbody>
                {players.map((player) => (
                    <tr key={player.id}>
                        <td>{player.id}</td>
                        <Button 
                            disabled={player.id == selectedPlayerId} 
                            color={player.id == selectedPlayerId ? "secondary" : "success"}
                            onClick={() => handleGuess(
                                parseInt(cookies.user_id ? cookies.user_id : "No user_id cookie"),
                                parseInt(cookies.game_id ? cookies.game_id : "No game_id cookie"), 
                                player.id
                            )}> 
                            Guess
                        </Button>
                    </tr> 
                ))}
            </tbody>
        </table>
        <SpotifyPlayer token={cookies.access_token ? cookies.access_token : "No access token cookie"} uris={[`spotify:track:${currentTrackId}`]} 
        styles={{
            activeColor: '#fff',
            bgColor: '#333',
            color: '#fff',
            loaderColor: '#fff',
            sliderColor: '#1cb954',
            trackArtistColor: '#ccc',
            trackNameColor: '#fff',
        }}/>;
        <br/>
    </>);

    async function handleGuess(user_id: number, game_id: number, guessed_player_id: number) {
        const guess = await api.UpsertGuess(user_id, game_id, guessed_player_id);
        setSelectedPlayerId(guessed_player_id);
    }
}