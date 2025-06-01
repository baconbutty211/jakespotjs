// @ts-ignore
import * as database from './database.js';
// @ts-ignore
import * as schema from './schema.js';
import { VercelRequest, VercelResponse } from '@vercel/node';

// Returns game with given id.
// Body : { game_id }
export default async function POST(request: VercelRequest, response: VercelResponse) {
    try {
        const id = request.body.song_id as schema.Song["id"];

        if (!id) {
            throw new Error("song id required.");
        }

        const song: schema.Song[] = await database.findSongById(id);
        response.setHeader('Content-Type', 'application/json');
        response.status(200).json(song[0]);
    }
    catch (error) {
        console.error(error);
        response.status(500).json({ error });
    }
}