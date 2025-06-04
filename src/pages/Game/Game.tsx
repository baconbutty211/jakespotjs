import { useEffect, useState } from "react";
import * as schema from "../../requests/Schema";
import Title from "../../components/Title";
import * as api from "../../requests/Backend";
import { useCookies } from "react-cookie";
import Guessing from "./Guessing";
import Scoring from "./Scoring";
import Finished from "./Finished";
import Pusher from "pusher-js";

export default function Game() {
    const [cookies, SetCookie] = useCookies(['user_id', 'game_id', 'player_id', 'host', 'spotify_access_token']);
    const [players, setPlayers] = useState<schema.Player[]>([]);
    const [loading, setLoading] = useState<Boolean>(true);
    const [gameState, setGameState] = useState<'guessing' | 'scoring' | 'finished'>('guessing')


    useEffect(() => {        
        const pusher = new Pusher(
            import.meta.env.VITE_PUSHER_KEY as string,
            {
                cluster: import.meta.env.VITE_PUSHER_CLUSTER as string,
            }
        );

        // Subscribe to the game channel
        const channel = pusher.subscribe(`game-${cookies.game_id}`);

        // listens for new players joining the game
        channel.bind('player-joined', (data: { players: schema.Player[] }) => {
            console.log("New player joined:", data.players);
            setPlayers(data.players); // Update the players state with the new list of players
            setLoading(false); // Set loading to false once players are loaded
        });

        // listens for game state updates
        channel.bind('game-state-updated', (data: { game: schema.Game }) => {
            setGameState(data.game.state as 'guessing' | 'scoring' | 'finished');      
            console.log("Game state updated:", data.game);
        });
        
        fetchGameState(); 
        fetchPlayers(); // Fetch initial list of players

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            pusher.disconnect();
        };
    }, []);


    async function fetchPlayers() {
        try {
            const data: schema.Player[] = await api.RetrievePlayers(cookies.game_id); // API endpoint to get the list of players
            setPlayers(data); // Update the players state with the fetched data
            setLoading(false);
        } catch (error: any) {
            console.error('Error fetching players:', error);
        }
    }
    async function fetchGameState() {
        try {
            const game: schema.Game = await api.RetrieveGame(cookies.game_id); // API endpoint to get the list of players
            if(game.state === "lobby")
                throw new Error(`Should NOT be on this page when game state is ${game.state}`)
            else
                setGameState(game.state);
        } catch (error: any) {
            console.error('Error:', error);
        }
    }

    return (<>
            <Title>Game</Title>
            {
                // BIG if else ternary operators (if/else doesn't compile/throws errors?)
                loading ? 
                    "Loading players..." :
                (gameState === "guessing") ?
                    <Guessing players={players} game_id={cookies.game_id} user_id={cookies.user_id} host={cookies.host} access_token={cookies.spotify_access_token}  /> :
                (gameState === "scoring") ?
                    <Scoring players={players}  game_id={cookies.game_id} user_id={cookies.user_id} player_id={cookies.player_id} host={cookies.host} spotify_access_token={cookies.spotify_access_token}/> :
                (gameState === "finished") ?
                    <Finished players={players} cookies={cookies}/> :
                new Error(`gameState should NOT be ${gameState}`)
            }
        </>)
};