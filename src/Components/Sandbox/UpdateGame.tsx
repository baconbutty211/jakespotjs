import Button from '../Button';
import Input from '../Input';
import { api_uri } from '../../misc';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import CustomDropdown from '../Dropdown';


export function UpdateState() {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [cookies, SetCookies] = useCookies(['game_id']);
    
    async function handleUpdateGame(selectedItem: string | null) {
        setSelectedItem(selectedItem);

        const updatedGame = await fetch(api_uri + '/update-game.tsx', {
            method: "POST",
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify({ id: cookies.game_id, state: selectedItem })
        }); 
        if (updatedGame.ok) {
            const updatedGameData = await updatedGame.json();
            console.log(updatedGameData);
        }
    }


    return (
        <>
            <CustomDropdown id='GameStateDrpDwn' title='Select new Game State' items={['lobby', 'guessing', 'scoring', 'finished']} onSelect={ handleUpdateGame } />
        </>
    );
}