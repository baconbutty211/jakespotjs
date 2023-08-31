// @ts-ignore
import * as database from './database.tsx';
// @ts-ignore
import * as schema from './schema.tsx'
import { VercelRequest, VercelResponse } from '@vercel/node';
 

// Recieves user details (email, access token, refresh token). If user exists: current record is updated. if user does not exist: new record is created. Returns new/updated user record.
// Body: { id, state?, new_song_id? }
export default async function POST(request: VercelRequest, response: VercelResponse) {
    try {

        const id = request.body.id as number;
        const state = request.body.state as schema.Game["state"];
        const new_song_id = request.body.new_song_id as schema.Song["id"];

        const updateGameData = {} as schema.UpdateableGame;
        if (!id) {
            throw new Error("id required.")
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
            guesses.forEach(async (guess) => {
                if(guess.is_correct) {
                    await database.incrementPlayerScore(guess.player_id);
                }
            });
        }
        const updatedGame = await database.updateGame( updateGameData );
        return response.status(200).json( updatedGame );
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({ error });
    }
}