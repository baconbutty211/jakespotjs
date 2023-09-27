//@ts-ignore
import * as schema from "./schema";
//@ts-ignore
import * as database from "./database";
import { VercelRequest, VercelResponse } from '@vercel/node';
 
// Receives ???. Creates new ??? record. Updates ??? record. Returns new/updated ??? record.
// Body : { user_id, game_id, guessed_player_id }
export default async function PUT(request: VercelRequest, response: VercelResponse) {
    try {
        const user_id = request.body.user_id as number;
        const game_id = request.body.game_id as number;
        const guessed_player_id = request.body.guessed_player_id as number; // Not sure where this is going to come from, may end up being some other variable.
    
        if(!user_id || !game_id) {
            let errmsg = "";
            if (!user_id) {
                errmsg += "User Id ";
            }
            if(!game_id) {
                errmsg += "Game Id ";
            }
            if (!guessed_player_id) {
                errmsg += "Guessed Player Id ";
            }
            errmsg += "required";
            throw new Error(errmsg);
        }
    
        // Get Player with User Id and Game Id
        const player = await database.findPlayerByGameAndUserIds(user_id, game_id);
        // Check if Guess is correct
        const is_correct : boolean = await database.isGuessCorrect(game_id, guessed_player_id);
        if (is_correct === undefined || is_correct === null) {
            throw new Error(`guess is invalid (is_correct: ${is_correct}) (game_id: ${game_id}, guessed_player_id: ${guessed_player_id})`)
        }

        // Get Game
        const game = await database.findGameById(game_id);

        // Create new guess with Player ID and Guessed Player ID 
        if (!game.current_song_id) {
            console.error(`Game has no current song id set ${game}`);
            throw new Error(`Something went wrong in the game logic. Tried to access the current song id before it was set.`);
        }
        
        const newGuessData : schema.NewGuess = {player_id: player.id, guessed_player_id: guessed_player_id, current_song_id: game.current_song_id, is_correct: is_correct };
        const newGuess = await database.upsertGuess(newGuessData);
        return response.status(200).json( newGuess );
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({ error });
    }
}