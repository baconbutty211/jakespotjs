import Button from './Button';
import { api_uri } from '../misc';
import { useCookies } from 'react-cookie';


export default function CreatePlayer() {
    const [cookies, SetCookie] = useCookies(['user_id', 'game_id', 'player_id']);
    return (
        <>
            <Button onClick={CreatePlayer}>Create Player</Button>
        </>
    );

    async function CreatePlayer() {
        const newPlayer = await fetch(api_uri + '/create-player.tsx', {
            method: "POST",
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify({ user_id: cookies.user_id, game_id: cookies.game_id, spotify_playlist_id: 'sandbox-spi'})
        }); 
        if (newPlayer.ok) {
            const newPlayerData = await newPlayer.json()
            //console.log(newPlayerData);
            SetCookie('player_id', newPlayerData.id);
        }
    }
}