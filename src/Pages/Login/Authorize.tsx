import Button from "../../Components/Button";
import Title from "../../Components/Title";
import { GetAuthCode } from "../../Components/Spotify/Authorization"


function Authorize() {
  return (
    <>
      <Title>Login</Title>
      <Button onClick={GetAuthCode}>Login to Spotify</Button>{" "}
    </>
  );
}

export default Authorize;
