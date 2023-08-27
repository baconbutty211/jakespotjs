// @ts-ignore
import { createGame } from '../database.tsx';
import { VercelRequest, VercelResponse } from '@vercel/node';
 
// Creates new game record. Returns new game record
// Body : {}
export default async function POST(request: VercelRequest, response: VercelResponse) {
    try {
    const newGame = await createGame({state: "lobby"});
    return response.status(200).json( newGame );
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({ error });
    }
}