// @ts-ignore
import * as database from './database.js';
// @ts-ignore
import * as schema from './schema.js';
import { VercelRequest, VercelResponse } from '@vercel/node';

// Returns game with given id.
// Body : { game_id }
export default async function POST(request: VercelRequest, response: VercelResponse) {
    try {
        const id = request.body.game_id as schema.Game["id"];

        if (!id) {
            throw new Error("game id required.");
        }

        const game: schema.Game = await database.findGameById(id);
        response.setHeader('Content-Type', 'application/json');
        response.status(200).json(game);
    }
    catch (error) {
        console.error(error);
        response.status(500).json({ error });
    }
}