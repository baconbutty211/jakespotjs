import Title from "../../components/Title";
import Button from "../../components/Button";
import { CreateGame } from "../../requests/Backend";
import { useCookies } from "react-cookie";
import Input from "../../components/Input";
import { SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Landing() {
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['game_id']);
    const [inputValue, setInputValue] = useState('game_id');
    
    return (
        <>
            <Title>Landing</Title>
            <Button onClick={handleCreateGame}>Create Game</Button>
            <br />
            <br />

            <div style={{display: 'flex'}}>
                <div style={{display: 'inline-block'}}>
                    <Input value={inputValue} onChange={handleInputChange} type="number" placeholder="Enter game code..."/>
                </div>
                <div style={{display: 'inline-block', alignSelf: 'center'}}>
                    <Button onClick={handleJoinGame}>Join Game</Button>
                </div>
            </div>
        </>
    );
    
    async function handleCreateGame() {
        try{
            // Insert row into Game table
            const newGameData = await CreateGame();
            console.log(newGameData);
            // Set game_id cookie
            setCookie("game_id", newGameData.id);
            console.log(cookies.game_id);
            // Send user to Buffet
            navigate("/Buffet");
        }
        catch (error) {
            console.error(error)
        };
    }
    function handleJoinGame() {
        try { 
            // Check game_id is valid/exists

            // Set game_id cookie
            setCookie("game_id", inputValue);
            // Send user to Buffet
            navigate("/Buffet");
        }
        catch(error) {
            console.error(error);
        }
    }
    function handleInputChange(e: { target: { value: SetStateAction<string>; }; }) {
        setInputValue(e.target.value);
    }
}
