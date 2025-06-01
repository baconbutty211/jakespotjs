// @ts-ignore
import * as database from './database.js';
// @ts-ignore
import * as schema from './schema.js';
import { VercelRequest, VercelResponse } from '@vercel/node';


// Recieves user details (email, access token, refresh token). If user exists: current record is updated. if user does not exist: new record is created. Returns new/updated user record.
// Body: { game_id, state? }
export default async function POST(request: VercelRequest, response: VercelResponse) {
    try {
        const game_id = request.body.game_id as schema.Game["id"];
        const state = request.body.state as schema.Game["state"];

        // console.log(request.body);
        // console.log(request.body["game_id"]);
        // console.log(request.body["state"]);

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


        if (state === "scoring") { // Score for the players
            const guesses = await database.findLatestGuessesByGameId(game_id);
            if (guesses.length == 0) {
                throw new Error("Attempted to score when no players have guessed. (Guesses[] empty)");
            }
            else {
                console.log(`Guesses: ${guesses}`);
                guesses.forEach(async (guess: any) => {
                    if (guess.is_correct) {
                        await database.incrementPlayerScore(guess.player_id);
                    }
                });
            }
        }
        if (state === "guessing") {
            // Set new current song for the game
            const players = await database.findPlayersByGameId(game_id);
            const randomPlayer = players[Math.floor(Math.random() * players.length)];
            const song = await database.findSongsByPlayerId(randomPlayer.id);
            updateGameData.current_song_id = song[0].id;
        }
        const updatedGame: schema.Game = await database.updateGame(updateGameData);
        console.log(updatedGame);
        return response.status(200).json(updatedGame);
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({ error });
    }
}