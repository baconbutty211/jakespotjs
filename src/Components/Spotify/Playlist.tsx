// User's playlists
export async function GetUserPlaylists(accessToken: string, userId: string) {
  const limit : number = 50;
  const offset : number = 0;
  const result = await fetch(`https://api.spotify.com/users/${userId}/playlists?limit=${limit}&offset=${offset}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  });
  return result;
}