import Button from '../Button';
import Input from '../Input';
import * as api from '../../requests/Backend';
import { SetStateAction, useState } from 'react';
import { useCookies } from 'react-cookie';


export default function UpsertGuess() {
    const [cookies, SetCookies] = useCookies(['game_id', 'user_id']);
    const [inputValue, setInputValue] = useState('');
    
    function handleInputChange (e: { target: { value: SetStateAction<string>; }; }) {
        setInputValue(e.target.value);
      };
    

    async function handleUpsertGuess() {
        const guessed_player_id: number = parseInt(inputValue);
        const updatedGuess = await api.UpsertGuess(cookies.user_id, cookies.game_id, guessed_player_id);
        console.log(updatedGuess);
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