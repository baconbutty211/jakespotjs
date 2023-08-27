import * as schema from "../../schema";
import * as database from "../../database";
import { VercelRequest, VercelResponse } from '@vercel/node';

// Recieves Game id and new state, updates new state and returns the updated record
// Body: {id, new_song_id}
export default async function PUT(request : VercelRequest, response: VercelResponse) {
    try 
    {
        const id = request.body.id;
        const new_song_id = request.body.new_song_id;
        const updatedGame = await database.updateGame({id: id, current_song_id: new_song_id});
        return response.status(200).json( updatedGame );
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({ error });
    }
}