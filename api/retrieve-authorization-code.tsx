import { SpotifyWebApi } from "spotify-web-api-ts";

import { redirect_uri, GetRandomInt } from "../src/misc";
const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const client_secret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const spotify_web_api = new SpotifyWebApi({clientId: client_id, clientSecret: client_secret, redirectUri: redirect_uri});



import { VercelRequest, VercelResponse } from '@vercel/node';

// @returns Spotify authorization code
export default function GET(request: VercelRequest, response: VercelResponse) { 
    try { 
        const authcode: string = spotify_web_api.getRefreshableAuthorizationUrl({ 
            scope: ["user-read-email", "user-read-private"], 
            state: GetRandomInt(1e16).toString(), 
            show_dialog: true
        });

        console.log(`Authorization code: ${authcode}`);
        response.status(200).json( authcode ); 
    }
    catch (error) {
        console.error(error);
        response.status(500).json({ error });
    }
}