import { GetToken } from '../../Components/Spotify/Authorization';
import { GetUserProfile } from '../../Components/Spotify/User';
import { api_uri } from '../../misc'


async function ExchangeAuthCodeForAccessToken(authCode: string) {
  const token = await GetToken(authCode);
  const data = await token.json();
  if (data.error === "invalid_grant" && data.error_description === "Invalid authorization code") { // Tried to request access token with the same authorization code.
    throw Error("Invalid authorization code. Tried to request access token with the same authorization code");
  }
  else { // Authorization code is valid
    const user = await GetUserProfile(data.access_token);
    const profile = await user.json();

    const email = profile.email;
    const access_token = data.access_token;
    const refresh_token = data.refresh_token;
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
    else {
      await fetch(api_uri + '/Create/User', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, accessToken: access_token, refreshToken: refresh_token }),
      });
    }
  }
}

export default function Token() {
  const queryParams = new URLSearchParams(window.location.search);
  const state = queryParams.get("state"); // Created in the authorization step
  const authCode = queryParams.get("code");

  if (authCode == null) {
    console.error("Authorization failed");
  }
  else if (state !== sessionStorage.getItem("state")) {
    console.error("Authorization state does not match state generated before authorization. Something dodgy may be going on"); 
  }
  else { // Authoization succeeded
    const exchange = ExchangeAuthCodeForAccessToken(authCode);
    exchange.then(() => {
      window.location.href = "/Landing";
    });
    exchange.catch((error) => {
      console.error(error);
    })
  }
  return <></>;
};