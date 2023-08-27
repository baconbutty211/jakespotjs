//@ts-ignore
import * as schema from "../../schema.tsx";
//@ts-ignore
import * as database from "../../database.tsx";
import { VercelRequest, VercelResponse } from '@vercel/node';
 
// Receives ???. Creates new ??? record. Updates ??? record. Returns new/updated ??? record.
// Body : { ??? }
export default async function POST(request: VercelRequest, response: VercelResponse) {
    try {
        // const <var> = request.body.<var>
        // const newGame = await database.example({ body });
        // return response.status(200).json( newGame );
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({ error });
    }
}