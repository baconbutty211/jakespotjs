import { useEffect, useState } from "react";
import { Player } from "../../../api/schema";
import Title from "../../components/Title";
import * as api from "../../requests/Backend";
import Pusher from 'pusher-js';
import { useCookies } from "react-cookie";


export default function Lobby() {
    const [cookies, SetCookie] = useCookies(['game_id']);
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState<Boolean>(false);

    useEffect(() => {
        // Fetch initial list of players when the component mounts
        fetchPlayers();
        

        const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
            cluster: import.meta.env.VITE_PUSHER_CLUSTER
        });
            
        const channel = pusher.subscribe("JakeSpotJS");
        channel.bind("new_player", (newPlayer: Player) => {
            console.log(`New player event received: ${newPlayer}`);
            // Fetch updated list of players when the player_join event is received
            fetchPlayers();
        });
        
        return () => {
            pusher.unsubscribe("JakeSpotJS");
        };
    }, []);

    async function fetchPlayers() {
        try {
            setLoading(true);
            // Assuming you have an API endpoint to get the list of players
            const data: Player[] = await api.RetrievePlayers(cookies.game_id);

            setPlayers(data); // Update the players state with the fetched data
            setLoading(false);
        } catch (error: any) {
            console.error('Error fetching players:', error);
            setLoading(false);
        }
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
    </>);

};

