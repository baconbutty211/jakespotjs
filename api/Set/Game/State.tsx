import * as schema from "../../schema";
import * as database from "../../database";
import { VercelRequest, VercelResponse } from '@vercel/node';

// Recieves Game id and new state, updates new state and returns the updated record
// Body: { id, state }
export default async function PUT(request : VercelRequest, response: VercelResponse) {
    try 
    {
        const id = request.body.id;
        const state = request.body.state;
        const updatedGame = await database.updateGame({id: id, state: state});
        return response.status(200).json( updatedGame );
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({ error });
    }
}