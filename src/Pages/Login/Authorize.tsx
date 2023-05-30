import Button from "../../Components/Button";
import Title from "../../Components/Title";

function GetRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function Authorize() {
  const client_id: string = import.meta.env.VITE_CLIENT_ID;
  const redirect_uri: string = import.meta.env.VITE_REDIRECT_URI;

  // Redirects user to login to their Spotify Account & grant permission
  async function GetAuthCode() {
    var scope: string = "user-read-private user-read-email";
    var state: string = GetRandomInt(10000000000000000).toString();
    sessionStorage.setItem("state", state);

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

  return (
    <>
      <Title>Login</Title>
      <Button onClick={GetAuthCode}>Login to Spotify</Button>{" "}
    </>
  );
}

export default Authorize;
