// @ts-ignore
import * as database from './database.js';
// @ts-ignore
import * as schema from './schema.js';
import { VercelRequest, VercelResponse } from '@vercel/node';
 
// Returns all players in the game.
// Body : { id }
export default async function POST(request: VercelRequest, response: VercelResponse) {
    try {
        const id = request.body.id as schema.Game["id"];

        if (!id) {
            throw new Error("game id required.");
        }
        
        const players: schema.Player[] = await database.findPlayersByGameId(id);
        players.forEach(player => {
            console.log(player);
        });
        response.setHeader('Content-Type', 'application/json');
        response.status(200).json( players );
    }
    catch (error) {
        console.error(error);
        response.status(500).json({ error });
    }
}