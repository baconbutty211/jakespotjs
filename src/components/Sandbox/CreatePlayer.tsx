import Button from '../Button';
import { api_uri } from '../../misc';
import { useCookies } from 'react-cookie';
import * as api from '../../requests/Backend';


export default function CreatePlayer() {
    const [cookies, SetCookie] = useCookies(['user_id', 'game_id', 'player_id']);
    return (
        <>
            <Button onClick={handleCreatePlayer}>Create Player</Button>
        </>
    );

    async function handleCreatePlayer() {
        const newPlayer = await api.UpsertPlayer(cookies.user_id, cookies.game_id, 'sandbox-spi');
        SetCookie('player_id', newPlayer.id);
        console.log(newPlayer);
    }
}