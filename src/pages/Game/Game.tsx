import { useEffect, useState } from "react";
import * as schema from "../../requests/Schema";
import Title from "../../components/Title";
import * as api from "../../requests/Backend";
import { useCookies } from "react-cookie";
import Guessing from "./Guessing";
import Scoring from "./Scoring";
import Finished from "./Finished";

export default function Game() {
    const [cookies, SetCookie] = useCookies(['user_id', 'game_id', 'player_id', 'host', 'spotify_access_token']);
    const [players, setPlayers] = useState<schema.Player[]>([]);
    const [loading, setLoading] = useState<Boolean>(false);
    const [gameState, setGameState] = useState<'guessing' | 'scoring' | 'finished'>('guessing')


    useEffect(() => {
        checkGameState();
        setLoading(true);
        fetchPlayers(); // Fetch initial list of players
        setLoading(false);
        
        const intervalId = setInterval(hasUpdate, 20000) // Fetch list of players on a set interval
        
        return () => clearInterval(intervalId);
    }, []);

    async function hasUpdate() {
        fetchPlayers();
        checkGameState();
    }
    async function fetchPlayers() {
        try {
            const data: schema.Player[] = await api.RetrievePlayers(cookies.game_id); // API endpoint to get the list of players
            setPlayers(data); // Update the players state with the fetched data
        } catch (error: any) {
            console.error('Error fetching players:', error);
        }
    }
    async function checkGameState() {
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