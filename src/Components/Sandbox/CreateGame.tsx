import Button from '../Button';
import { api_uri } from '../../misc';
import { useCookies } from 'react-cookie';


export default function CreateGame() {
    const [cookies, SetCookie] = useCookies(['game_id']);
    return (
        <>
            <Button onClick={handleCreateGame}>Create Game</Button>
        </>
    );

    async function handleCreateGame() {
        const newGame = await fetch(api_uri + '/create-game.tsx', {
            method: "POST"
        }); 
        if (newGame.ok) {
            const newGameData = await newGame.json()
            console.log(newGameData);
            SetCookie('game_id', newGameData.id);
        }
    }
}