// @ts-ignore
import * as database from './database.tsx';
// @ts-ignore
import * as schema from './schema.tsx';
import { VercelRequest, VercelResponse } from '@vercel/node';
 
// Creates new player record. Returns new player record
// Body : { user_id, game_id, spotify_playlist_id }
export default function POST(request: VercelRequest, response: VercelResponse) {
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
        database.createPlayer(newPlayerData).then((player: schema.NewPlayer) => {
            //console.log(player);
            response.setHeader('Content-Type', 'application/json');
            response.status(200).json( player );
        })
        .catch((error: any) => {
            console.error(error);
            response.status(500).json({ error });
        });
    }
    catch (error) {
        console.error(error);
        response.status(500).json({ error });
    }
}