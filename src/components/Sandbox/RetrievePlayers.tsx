import Button from '../Button';
import * as api from '../../requests/Backend';
import { useCookies } from 'react-cookie';


export default function RetrievePlayers() {
    const [cookies, SetCookie] = useCookies(['game_id']);
    return (
        <>
            <Button onClick={handleRetrievePlayers}>Retrieve Players</Button>
        </>
    );

    async function handleRetrievePlayers() {
        console.log('Sending request to server (retrieve players)...');
        const players = await api.RetrievePlayers(cookies.game_id);
        players.forEach((player: any) => {
            console.log(player);
        });
    }
}