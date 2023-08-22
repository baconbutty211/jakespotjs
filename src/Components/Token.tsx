import { GetToken } from './Spotify/Authorization';
import { GetUserProfile } from './Spotify/User';
import { api_uri } from '../misc'

async function SetAccessToken(email: string, accessToken: string, refreshToken: string) {
  await fetch(api_uri + '/insert-user', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      accessToken: accessToken,
      refreshToken: refreshToken,
    }),
  });
}

const Token = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const state = queryParams.get("state"); // Created in the authorization step
  const authCode = queryParams.get("code");

  //console.log(authCode);
  //console.log(state);
  if (authCode != null && state === sessionStorage.getItem("state")) {
    GetToken(authCode).then((result) => {
      const data = result.json();
      //console.log(data);
      data.then((data) => {
        //console.log(data);
        if (data.error === "invalid_grant" && data.error_description === "Invalid authorization code") { // Tried to request access token with the same authorization code.
          throw Error("Invalid authorization code. Tried to request access token with the same authorization code");
        } 
        else { // Authorization code is valid
          //sessionStorage.setItem("accessToken", data.access_token); // set access token
          //sessionStorage.setItem("refreshToken", data.refresh_token); // set refresh token
          GetUserProfile(data.access_token).then((user) => {
            const profile = user.json();
            profile.then((profile) => {
              //console.log(profile);
              const email = profile.email;
              SetAccessToken(email, data.access_token, data.refresh_token).then(() => {
                window.location.href = "/Landing";
              })
            });
          });
        }
      });
      data.catch((error) => {
        console.error(error);
      });
  });
  }
  return <></>;
};
export default Token;
