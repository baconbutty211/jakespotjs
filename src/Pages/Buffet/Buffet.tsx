import Title from "../../Components/Title";
import * as spotify from "../../Components/Spotify/Playlist";
import { useCookies } from "react-cookie";
import { api_uri } from "../../misc";


export default function Buffet() {
  const [cookies, SetCookie] = useCookies(['user_id']);
  async function getUser() {
    const userData = await fetch(api_uri + '/retrieve-user.tsx', {
      method: "POST",
      headers: { 'Content-Type' : 'application/json' },
      body: JSON.stringify({ id: cookies.user_id })
    });
    if (userData.ok) {
        const user = await userData.json()
        user.access_token
    }
    else {
      throw new Error('Failed to retrieve user data.')
    }
  }

  const user = getUser();
  const userPlaylists = spotify.GetUserPlaylists();
  return (
    <>
      <Title>Buffet</Title>
      <div className="card-deck">
        {}
      </div>
    </>
  );
}
