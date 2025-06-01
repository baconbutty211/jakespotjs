import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function GET(request: VercelRequest, response: VercelResponse) {
    try {
        return response.status(200).json({ message: "Hello World!" });
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({ error });
    }
}