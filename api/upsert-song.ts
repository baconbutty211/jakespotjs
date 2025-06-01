//@ts-ignore
import * as database from "./database.js";
//@ts-ignore
import * as schema from "./schema.js";
import { VercelRequest, VercelResponse } from '@vercel/node';

// Receives ???. Creates new ??? record. Updates ??? record. Returns new/updated ??? record.
// Body : { player_id, spotify_track_id }
export default async function PUT(request: VercelRequest, response: VercelResponse) {
    try {
        const player_id = request.body.player_id as number;
        const spotify_track_id = request.body.spotify_track_id as string;

        if (!player_id || !spotify_track_id) {
            let errmsg = "";
            if (!player_id) {
                errmsg += "Player Id ";
            }
            if (!spotify_track_id) {
                errmsg += "Spotify Track Id ";
            }
            errmsg += "required";
            throw new Error(errmsg);
        }

        const newSongData: schema.NewSong = { player_id: player_id, spotify_track_id: spotify_track_id };
        const newSong = await database.upsertSong(newSongData);
        return response.status(200).json(newSong);
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({ error });
    }
}