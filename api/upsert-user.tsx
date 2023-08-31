// @ts-ignore
import * as database from './database.js';
// @ts-ignore
import * as schema from './schema.js';
import { VercelRequest, VercelResponse } from '@vercel/node';
 
// Recieves user details (email, access token, refresh token). If user exists: current record is updated. if user does not exist: new record is created. Returns new/updated user record.
// Body: { email, access token, refresh token }
export default async function PUT( request: VercelRequest, response: VercelResponse) {
  try {
    const email = request.body.email as string;
    const access_token = request.body.access_token as string;
    const refresh_token = request.body.refresh_token as string;

    if(!email || !access_token || !refresh_token) {
      let errmsg = "";
      if (!email)
        errmsg += "email ";
      if( !access_token )
        errmsg += "access token ";
      if( !refresh_token) 
        errmsg += "refresh token ";

      errmsg += "required"
      throw new Error(errmsg);
    }

    const newUserData : schema.NewUser = {email: email, spotify_access_token: access_token, spotify_refresh_token: refresh_token};
    const newUser = await database.upsertUser(newUserData);
    return response.status(200).json( newUser );
  } 
  catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
}