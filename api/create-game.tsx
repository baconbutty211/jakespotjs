// @ts-ignore
import * as database from './database.tsx';
// @ts-ignore
import * as schema from './schema.tsx';
import { VercelRequest, VercelResponse } from '@vercel/node';
 
// Creates new game record. Returns new game record
// Body : {}
export default async function POST(request: VercelRequest, response: VercelResponse) {
    try {
        const newGameData = { state: "lobby" } as schema.Game;
        const newGame = await database.createGame(newGameData);
        return response.status(200).json( newGame );
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({ error });
    }
}