// @ts-ignore
import * as database from './database.js';
// @ts-ignore
import * as schema from './schema.js';
import { VercelRequest, VercelResponse } from '@vercel/node';
import Pusher from "pusher";

const pusher = new Pusher({
    appId: process.env.VITE_PUSHER_APP_ID as string,
    key: process.env.VITE_PUSHER_KEY as string,
    secret: process.env.VITE_PUSHER_SECRET as string,
    cluster: process.env.VITE_PUSHER_CLUSTER as string,
    useTLS: true
});

// Recieves user details (email, access token, refresh token). If user exists: current record is updated. if user does not exist: new record is created. Returns new/updated user record.
// Body: { game_id, state? }
export default async function POST(request: VercelRequest, response: VercelResponse) {
    try {
        const game_id = request.body.game_id as schema.Game["id"];
        const state = request.body.state as schema.Game["state"];

        const updateGameData = {} as schema.UpdateableGame;
        if (!game_id) {
            throw new Error("id required.");
        }
        else {
            updateGameData.id = game_id;
        }

        if (state) {
            updateGameData.state = state;
        }
        else {
            throw new Error("state or new song id required.");
        }


        if (state === "guessing") { // Set new current song for the game
            const players = await database.findPlayersByGameId(game_id);
            const randomPlayer = players[Math.floor(Math.random() * players.length)];
            const song = await database.findSongsByPlayerId(randomPlayer.id);
            updateGameData.current_song_id = song[0].id;

        }

        const updatedGame: schema.Game = await database.updateGame(updateGameData);
        console.log(updatedGame);

        // Broadcast game state update to clients
        pusher.trigger(`game-${game_id}`, 'game-state-updated', {
            game: updateGameData
        });

        return response.status(200).json(updatedGame);
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({ error });
    }
}