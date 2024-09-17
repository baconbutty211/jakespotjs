import { useEffect, useState } from "react";
import { Player } from "../../../api/node/schema";
import Title from "../../components/Title";
import * as api from "../../requests/Backend";
import { useCookies } from "react-cookie";
import Button from "../../components/Button";


export default function Lobby() {
    const [cookies, SetCookie] = useCookies(['game_id']);
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState<Boolean>(false);

    useEffect(() => {
        // Fetch initial list of players when the component mounts
        fetchPlayers();      
    }, []);

    async function fetchPlayers() {
        try {
            setLoading(true);
            const data: Player[] = await api.RetrievePlayers(cookies.game_id); // API endpoint to get the list of players

            setPlayers(data); // Update the players state with the fetched data
            setLoading(false);
        } catch (error: any) {
            console.error('Error fetching players:', error);
            setLoading(false);
        }
    }

    async function startGame() {
        throw new Error('Not implemented');
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
        <Button onClick={startGame}>Start Game</Button>
    </>);

};

