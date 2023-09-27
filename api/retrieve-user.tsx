// @ts-ignore
import * as database from './database';
// @ts-ignore
import * as schema from './schema';
import { VercelRequest, VercelResponse } from '@vercel/node';
 
// Returns all players in the game.
// Body : { id }
export default async function POST(request: VercelRequest, response: VercelResponse) {
    try {
        const id = request.body.id as schema.User["id"];

        if (!id) {
            throw new Error("user id required.");
        }

        const user: schema.User[] = await database.findUserById(id);
        response.setHeader('Content-Type', 'application/json');
        response.status(200).json( user[0] );
    }
    catch (error) {
        console.error(error);
        response.status(500).json({ error });
    }
}