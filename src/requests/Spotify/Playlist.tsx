import GetUser from "../Backend/GetUser";

// User's playlists
export async function GetUserPlaylists() {
  const user = await GetUser();
  //console.log(user);

  const limit : number = 50;
  const offset : number = 0;
  const result = await fetch(`https://api.spotify.com/v1/users/${user.spotify_user_id}/playlists?limit=${limit}&offset=${offset}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${user.spotify_access_token}`,
    }
  });
  if (result.ok) {
    const playlists = await result.json()
    return playlists;
  }
  else {
    throw new Error('Failed to retrieve user data.')
  }
}