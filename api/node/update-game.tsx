// @ts-ignore
import * as database from './database.js';
// @ts-ignore
import * as schema from './schema.js';
import { VercelRequest, VercelResponse } from '@vercel/node';
 

// Recieves user details (email, access token, refresh token). If user exists: current record is updated. if user does not exist: new record is created. Returns new/updated user record.
// Body: { id, state?, new_song_id? }
export default async function POST(request: VercelRequest, response: VercelResponse) {
    try {
        const id = request.body.id as schema.Game["id"];
        const state = request.body.state as schema.Game["state"];
        const new_song_id = request.body.new_song_id as schema.Song["id"];

        // console.log(request.body);
        // console.log(request.body["id"]);
        // console.log(request.body["state"]);

        const updateGameData = {} as schema.UpdateableGame;
        if (!id) {
            throw new Error("id required.");
        }
        else {
            updateGameData.id = id;
        }

        if (state) {
            updateGameData.state = state;
        }
        else if (new_song_id) {
            updateGameData.current_song_id = new_song_id;
        }
        else {
            throw new Error("state or new song id required.");
        }


        if ( state === "scoring" ) { // Score for the players
            const guesses = await database.findLatestGuessesByGameId(id);
            if(guesses.length == 0) {
                throw new Error("Attempted to score when no players have guessed. (Guesses[] empty)");
            }
            else {
                console.log(`Guesses: ${guesses}`);
                guesses.forEach(async (guess: any) => {
                    if(guess.is_correct) {
                        await database.incrementPlayerScore(guess.player_id);
                    }
                });
            }
        }
        const updatedGame: schema.Game = await database.updateGame( updateGameData );
        console.log(updatedGame);
        return response.status(200).json( updatedGame );
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({ error });
    }
}