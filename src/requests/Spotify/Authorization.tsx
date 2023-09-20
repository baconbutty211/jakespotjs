import { GetRandomInt, redirect_uri } from "../../misc";

const client_id: string = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const client_secret: string = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

// Authorization Code
// Redirects user to login to their Spotify Account & grant permission
export async function GetAuthCode() {
  var scope: string = "user-read-private user-read-email";
  var state: string = GetRandomInt(1e16).toString();
  sessionStorage.setItem("state", state);
  //console.log(state);
  //console.log(redirect_uri)
  var queryParams = {
    client_id: client_id,
    response_type: "code",
    redirect_uri: redirect_uri,
    state: state,
    scope: scope,
    show_dialog: "false",
  };
  const queryString = new URLSearchParams(queryParams).toString();
  const url = "https://accounts.spotify.com/authorize?" + queryString;

  window.location.href = url;
} // After redirects user to Token Page.

// Access Token
export async function GetToken(authCode: string) {
    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(client_id + ":" + client_secret),
      },
      body: `grant_type=authorization_code&redirect_uri=${redirect_uri}&code=${authCode}`,
    });
    return result;
}

// Refresh Token