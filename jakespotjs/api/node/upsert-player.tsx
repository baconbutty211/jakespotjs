import * as database from './database.js';
import * as schema from './schema.js';
import { VercelRequest, VercelResponse } from '@vercel/node';
 
// Recieves player details (user_id, game_id, spotify_playlist_id). If player exists: current record is updated. if player does not exist: new record is created. Returns new/updated player record.
// Body : { user_id, game_id, spotify_playlist_id }
// Returns new/updated player record
export default async function PUT(request: VercelRequest, response: VercelResponse) {
    try {
        const user_id = request.body.user_id as schema.Player["user_id"];
        const game_id = request.body.game_id as schema.Player["game_id"];
        const spotify_playlist_id = request.body.spotify_playlist_id as schema.Player["spotify_playlist_id"];

        if (!user_id) {
            throw new Error("user id required.");
        }
        if (!game_id) {
            throw new Error("game id required.");
        }
        if (!spotify_playlist_id) {
            throw new Error("spotify playlist id required.");
        }

        const newPlayerData = { user_id: user_id, game_id: game_id, spotify_playlist_id: spotify_playlist_id, score: 0 } as schema.Player;
        const newPlayer: schema.NewPlayer = await database.upsertPlayer(newPlayerData);

        console.log(newPlayer);
        response.setHeader('Content-Type', 'application/json');
        response.status(200).json( newPlayer );
    }
    catch (error) {
        console.error(error);
        response.status(500).json({ error });
    }
}