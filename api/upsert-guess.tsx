//@ts-ignore
import * as schema from "./schema.js";
//@ts-ignore
import * as database from "./database.js";
import { VercelRequest, VercelResponse } from '@vercel/node';
 
// Receives ???. Creates new ??? record. Updates ??? record. Returns new/updated ??? record.
// Body : { user_id, game_id, guessed_user_id }
export default async function PUT(request: VercelRequest, response: VercelResponse) {
    try {
        const user_id = request.body.user_id as number;
        const game_id = request.body.game_id as number;
        const guessed_user_id = request.body.guessed_player_id as number; // Not sure where this is going to come from, may end up being some other variable.
    
        if(!user_id || !game_id) {
            let errmsg = "";
            if (!user_id) {
                errmsg += "User Id ";
            }
            if(!game_id) {
                errmsg += "Game Id ";
            }
            if (!guessed_user_id) {
                errmsg += "Guessed User Id ";
            }
            errmsg += "required";
            throw new Error(errmsg);
        }
    
        // Get Player with User Id and Game Id
        const player = await database.findPlayerByGameAndUserIds(user_id, game_id);
        const guessed_player = await database.findPlayerByGameAndUserIds(guessed_user_id, game_id);
        // Get Game
        const game = await database.findGameById(game_id);
        // Check if Guess is correct
        const is_correct : boolean = await database.isGuessCorrect(game.id, guessed_player.id);
        // Create new guess with Player ID and Guessed Player ID 
        if (!game.current_song_id) {
            console.error(`Game has no current song id set ${game}`);
            throw new Error(`Something went wrong in the game logic. Tried to access the current song id before it was set.`);
        }
        const newGuessData : schema.NewGuess = {player_id: player.id, current_song_id: game.current_song_id, guessed_player_id: guessed_player.id, is_correct: is_correct };
        const newGuess = await database.upsertGuess(newGuessData);
        return response.status(200).json( newGuess );        
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({ error });
    }
}