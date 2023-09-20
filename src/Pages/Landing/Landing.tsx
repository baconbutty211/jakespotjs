import Title from "../../components/Title";
import Button from "../../components/Button";
import Label from "../../components/Label";

export default function Landing() {
  function CreateGame() {
    // Insert row into Game table
    // Insert row into Player table
    // Send user to Buffet
  }
  function JoinGame() {
    // Insert row into Player table
    // Send user to Buffet
  }
  return (
    <>
      <Title>Landing</Title>
      <form>
        <Button onClick={CreateGame}>Create Game</Button>
        <br />
        <Label>Enter game code:</Label>
        <input type="number"></input>
        <Button onClick={JoinGame}>Join Game</Button>
      </form>
    </>
  );
}
