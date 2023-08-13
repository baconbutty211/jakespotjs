// @ts-ignore
import { createUser, findUsers, findLastUser } from './database.tsx';
import { VercelRequest, VercelResponse } from '@vercel/node';
 
export default async function POST( request: VercelRequest, response: VercelResponse) {
  try {
    const email = request.query.email as string;
    const accessToken = request.query.accessToken as string;
    const refreshToken = request.query.refreshToken as string;
    if (!email || !accessToken || !refreshToken){ 
      throw new Error('Email, access token, refresh token required');
    }
    await createUser({email: email, accesstoken: accessToken, refreshtoken: refreshToken});
  } 
  catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  }
  const users = await findLastUser();
  return response.status(200).json({ users });
}