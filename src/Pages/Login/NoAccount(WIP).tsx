import Button from "../../Components/Button";

interface LoginCredentials {
  client_id: string;
  client_secret: string;

  SetAccessToken: Function;
}

function NoAccountLogin(credentials: LoginCredentials) {
  const GetToken = async () => {
    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          btoa(credentials.client_id + ":" + credentials.client_secret),
      },
      body: "grant_type=client_credentials",
    });
    const data = await result.json();
    credentials.SetAccessToken(data.access_token);
  };

  return <Button onClick={GetToken}>Login without Spotify</Button>;
}
export default NoAccountLogin;
