// @ts-ignore
import { createUser, findUsers, findLastUser, findUserByEmail, updateUser } from './database.tsx';
import { VercelRequest, VercelResponse } from '@vercel/node';
 
export default async function POST( request: VercelRequest, response: VercelResponse) {
  try {
    const email = request.body.email as string;
    const accessToken = request.body.accessToken as string;
    const refreshToken = request.body.refreshToken as string;

    if(!email || !accessToken || !refreshToken) {
      let errmsg = "";
      if (!email)
        errmsg += "email ";
      if( !accessToken )
        errmsg += "access token ";
      if( !refreshToken) 
        errmsg += "refresh token ";

      errmsg += "required"
      throw new Error(errmsg);
    }

    const user = await findUserByEmail(email);
    //console.log(user);
    let result = null;
    if(JSON.stringify(user) === "[]") { // user does NOT exist
      result = await createUser({email: email, spotify_access_token: accessToken, spotify_refresh_token: refreshToken});
    }
    else { // user DOES exist
      result = await updateUser(email, {spotify_access_token: accessToken, spotify_refresh_token:refreshToken});
    }
  } 
  catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
  const users = await findLastUser();
  return response.status(200).json({ users });
}