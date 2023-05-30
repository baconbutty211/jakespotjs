const Token = () => {
  const client_id: string = import.meta.env.VITE_CLIENT_ID;
  const client_secret: string = import.meta.env.VITE_CLIENT_SECRET;

  async function GetToken(authCode: string) {
    const redirect_uri: string = import.meta.env.VITE_REDIRECT_URI;
    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(client_id + ":" + client_secret),
      },
      body: `grant_type=authorization_code&redirect_uri=${redirect_uri}&code=${authCode}`,
    });
    const data = result.json();
    data.then((data) => {
      console.log(data);
      sessionStorage.setItem("accessToken", data.access_token); // set access token
      sessionStorage.setItem("refreshToken", data.refresh_token); // set refresh token
    });
    data.catch((error) => {
      console.log(error);
    });
  }

  const queryParams = new URLSearchParams(window.location.search);
  const state = queryParams.get("state");
  const authCode = queryParams.get("code");

  if (authCode != null && state === sessionStorage.getItem("state")) {
    GetToken(authCode);
  } else {
    return <h1>I sense foul play</h1>;
  }
  return <></>;
};
export default Token;
