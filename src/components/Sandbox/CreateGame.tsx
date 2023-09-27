import Button from '../Button';
import { api_uri } from '../../misc';
import { useCookies } from 'react-cookie';
import { CreateGame as createGame } from '../../requests/Backend';

export default function CreateGame() {
    const [cookies, SetCookie] = useCookies(['game_id']);
    return (
        <>
            <Button onClick={handleCreateGame}>Create Game</Button>
        </>
    );

    async function handleCreateGame() {
        try{
            const newGameData = await createGame();
            console.log(newGameData);
            SetCookie('game_id', newGameData.id);
            return;

            const newGame = await fetch(api_uri + '/create-game.tsx', {
                method: "POST"
            }); 
            if (newGame.ok) {
                const newGameData = await newGame.json()
                console.log(newGameData);
                SetCookie('game_id', newGameData.id);
            }
        }
        catch (error) {
            console.error(error);
        }
    }
}