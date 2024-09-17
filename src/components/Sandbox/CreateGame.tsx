import Button from '../Button';
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
        }
        catch (error) {
            console.error(error);
        }
    }
}