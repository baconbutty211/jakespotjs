import Button from "../../components/Button";
import Title from "../../components/Title";
import { GetAuthCode } from "../../requests/Spotify/Authorization"


export default function Authorize() {
  return (
    <>
      <Title>Login</Title>
      <Button onClick={GetAuthCode}>Login to Spotify</Button>{" "}
    </>
  );
}