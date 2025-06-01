import { useEffect, useState } from "react";
import * as schema from "../../requests/Schema";
import Title from "../../components/Title";
import * as api from "../../requests/Backend";
import { useCookies } from "react-cookie";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { LobbyPlayerTable } from "../../components/PlayerTable";


export default function Lobby() {
    const navigate = useNavigate();
    const [cookies, SetCookie] = useCookies(['game_id', 'host']);
    const [players, setPlayers] = useState<schema.Player[]>([]);
    const [loading, setLoading] = useState<Boolean>(false);

    useEffect(() => {
        checkGameStarted();
        setLoading(true);
        fetchPlayers(); // Fetch initial list of players
        setLoading(false);
        
        const intervalId = setInterval(hasUpdate, 100000) // Fetch list of players on a set interval
        
        return () => clearInterval(intervalId);
    }, []);


    async function hasUpdate() {
        fetchPlayers();
        checkGameStarted();
    }
    async function fetchPlayers() {
        try {
            const data: schema.Player[] = await api.RetrievePlayers(cookies.game_id); // API endpoint to get the list of players
            setPlayers(data); // Update the players state with the fetched data
        } catch (error: any) {
            console.error('Error fetching players:', error);
        }
    }
    async function checkGameStarted() {
        try {
            const game: schema.Game = await api.RetrieveGame(cookies.game_id); // API endpoint to get the list of players
            if(game.state === "guessing") {
                navigate('/Game');
            }
        } catch (error: any) {
            console.error('Error fetching players:', error);
        }
    }

    async function handleStartGame() {
        const newGame = await api.UpdateGame(cookies.game_id, "guessing");
        if(newGame.state === "guessing") {
            navigate('/Game');
        }
        else {
            throw new Error(`Game state NOT updated to guessing. ${newGame}`);
        }
        //updateGame({ id: cookies.game_id, state: "guessing" });
    }

    if(loading){
        return (<>
            <Title>Lobby</Title>
            Loading players...
        </>)
    }

    return (<>
        <h1>Lobby - Game id: {cookies.game_id} </h1>
        <LobbyPlayerTable players={players}/>
        <br/>
        { cookies.host ? <Button onClick={handleStartGame}>Start Game</Button> : <></> }
    </>);

};