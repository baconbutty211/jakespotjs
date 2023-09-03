import Button from '../Button';
import Input from '../Input';
import { api_uri } from '../../misc';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import CustomDropdown from '../Dropdown';


export default function UpdateGame() {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    
    async function handleUpdateGame(selectedItem: string | null) {
        setSelectedItem(selectedItem);

        const [cookies, SetCookies] = useCookies(['game_id']);
        const updatedGame = await fetch(api_uri + '/update-game.tsx', {
            method: "POST",
            body: JSON.stringify({ id: cookies.game_id, state: selectedItem })
        }); 
        if (updatedGame.ok) {
            const updatedGameData = await updatedGame.json()
            console.log(updatedGameData);
        }
    }


    return (
        <>
            <CustomDropdown id='GameStateDrpDwn' title='Select new Game State' items={['lobby', 'guessing', 'scoring', 'finished']} onSelect={ handleUpdateGame } />
        </>
    );
}