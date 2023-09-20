import { useCookies } from "react-cookie";
import { api_uri } from "../../misc";

export default async function GetUser() {
  const [cookies, SetCookie] = useCookies(['user_id']);
  
  const result = await fetch(api_uri + '/retrieve-user.tsx', {
    method: "POST",
    headers: { 'Content-Type' : 'application/json' },
    body: JSON.stringify({ id: cookies.user_id })
  });
  if (result.ok) {
      const user = await result.json()
      return user;
  }
  else {
    throw new Error('Failed to retrieve user data.')
  }
}