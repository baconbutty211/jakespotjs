import CustomDropdown from '../Dropdown';
import * as api from '../../requests/Backend';
import { useCookies } from 'react-cookie';


export function UpdateState() {
    const [cookies, SetCookies] = useCookies(['game_id']);
    
    async function handleUpdateGame(selectedItem: string | null) {
        if(selectedItem === null)
            return;
        else {
            const updatedGame = await api.UpdateGame(cookies.game_id, selectedItem);
            console.log(updatedGame);
        }
    }


    return (
        <>
            <CustomDropdown id='GameStateDrpDwn' title='Select new Game State' items={['lobby', 'guessing', 'scoring', 'finished']} onSelect={ handleUpdateGame } />
        </>
    );
}