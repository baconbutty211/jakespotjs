// User's Profile
export async function GetUserProfile(accessToken: string) {
    const result = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });
    return result;
}