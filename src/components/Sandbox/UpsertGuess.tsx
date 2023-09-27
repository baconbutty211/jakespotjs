import Button from '../Button';
import Input from '../Input';
import { api_uri } from '../../misc';
import { SetStateAction, useState } from 'react';
import { useCookies } from 'react-cookie';
import CustomDropdown from '../Dropdown';


export default function UpsertGuess() {
    const [cookies, SetCookies] = useCookies(['game_id', 'user_id']);
    const [inputValue, setInputValue] = useState('');
    
    function handleInputChange (e: { target: { value: SetStateAction<string>; }; }) {
        setInputValue(e.target.value);
      };
    

    async function handleUpsertGuess() {
        const guessed_player_id = inputValue;
        const updatedGame = await fetch(api_uri + '/upsert-guess.tsx', {
            method: "POST",
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify({ game_id: cookies.game_id, user_id: cookies.user_id, guessed_player_id: guessed_player_id })
        }); 
        if (updatedGame.ok) {
            const updatedGameData = await updatedGame.json();
            console.log(updatedGameData);
        }
    }


    return (
        <>
            <div style={{display: 'flex'}}>
                <div style={{display: 'inline-block'}}>
                    <Input type='text' value={inputValue} onChange={handleInputChange} placeholder='Enter guessed player id' />
                </div>
                <div style={{display: 'inline-block', alignSelf: 'center'}}>
                    <Button onClick={handleUpsertGuess}> Upsert Guess </Button>
                </div>
            </div>
        </>
    );
}