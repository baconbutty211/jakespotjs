// @ts-ignore
import * as database from './database.tsx';
// @ts-ignore
import * as schema from './schema.tsx';
import { VercelRequest, VercelResponse } from '@vercel/node';
 
// Returns all players in the game.
// Body : { id }
export default function POST(request: VercelRequest, response: VercelResponse) {
    try {
        const id = request.body.id as schema.Game["id"];

        if (!id) {
            throw new Error("game id required.");
        }

        database.findPlayersByGameId(id).then((players: schema.Player[]) => {
            players.forEach(player => {
                console.log(player);
            });
            response.setHeader('Content-Type', 'application/json');
            response.status(200).json( players );
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