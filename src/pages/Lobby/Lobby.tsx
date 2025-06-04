/// <reference types="vite/client" />

import { useEffect, useState } from "react";
import * as schema from "../../requests/Schema";
import Title from "../../components/Title";
import * as api from "../../requests/Backend";
import { useCookies } from "react-cookie";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { LobbyPlayerTable } from "../../components/PlayerTable";
import Pusher from 'pusher-js';


export default function Lobby() {
    const navigate = useNavigate();
    const [cookies, SetCookie] = useCookies(['game_id', 'host']);
    const [players, setPlayers] = useState<schema.Player[]>([]);
    const [loading, setLoading] = useState<Boolean>(true);

    useEffect(() => {
        Pusher.logToConsole = true; // Enable Pusher logging for debugging
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
            if(data.game.state === "guessing") {
                navigate('/Game');
            }        
        });

        // Fetch initial players when the component mounts
        fetchPlayers();

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            pusher.disconnect();
        };
    }, []);

    async function fetchPlayers() {
        try {
            const players: schema.Player[] = await api.RetrievePlayers(cookies.game_id);
            setPlayers(players);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching players:", error);
        }
    }

    async function handleStartGame() {
        const newGame = await api.UpdateGame(cookies.game_id, "guessing");
        /*if(newGame.state === "guessing") {
            navigate('/Game');
        }
        else {
            throw new Error(`Game state NOT updated to guessing. ${newGame}`);
        }*/
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