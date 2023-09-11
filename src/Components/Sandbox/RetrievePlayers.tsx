import Button from '../Button';
import { api_uri } from '../../misc';
import { useCookies } from 'react-cookie';


export default function RetrievePlayers() {
    const [cookies, SetCookie] = useCookies(['game_id']);
    return (
        <>
            <Button onClick={handleRetrievePlayers}>Retrieve Players</Button>
        </>
    );

    async function handleRetrievePlayers() {
        const playersData = await fetch(api_uri + '/retrieve-players.tsx', {
            method: "POST",
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify({ id: cookies.game_id })
        });
        if (playersData.ok) {
            const players = await playersData.json()
            players.forEach((player: any) => {
                console.log(player);
            });
        }
    }
}