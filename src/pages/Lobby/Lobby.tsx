import { useEffect, useState } from "react";
import { Player, Game } from "../../../api/node/schema";
import Title from "../../components/Title";
import * as api from "../../requests/Backend";
import { useCookies } from "react-cookie";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";


export default function Lobby() {
    const navigate = useNavigate();
    const [cookies, SetCookie] = useCookies(['game_id', 'host']);
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState<Boolean>(false);

    useEffect(() => {
        checkGameStarted();
        setLoading(true);
        fetchPlayers(); // Fetch initial list of players
        setLoading(false);
        
        const intervalId = setInterval(hasUpdate, 10000) // Fetch list of players on a set interval
        
        return () => clearInterval(intervalId);
    }, []);


    async function hasUpdate() {
        fetchPlayers();
        checkGameStarted();
    }
    async function fetchPlayers() {
        try {
            const data: Player[] = await api.RetrievePlayers(cookies.game_id); // API endpoint to get the list of players
            setPlayers(data); // Update the players state with the fetched data
        } catch (error: any) {
            console.error('Error fetching players:', error);
        }
    }
    async function checkGameStarted() {
        try {
            const game: Game = await api.RetrieveGame(cookies.game_id); // API endpoint to get the list of players
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
        <Title>Lobby</Title>
        <table>
            <thead> 
                <tr>
                    <th>Player</th>
                    <th>Score</th>
                </tr>
            </thead>
            <tbody>
                {players.map((player) => (
                    <tr key={player.id}>
                        <td>{player.id}</td>
                        <td>{player.score}</td>
                    </tr> 
                ))}
            </tbody>
        </table>
        <br/>
        { cookies.host ? <Button onClick={handleStartGame}>Start Game</Button> : <></> }
    </>);

};