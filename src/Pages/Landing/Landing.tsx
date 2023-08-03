import Title from "../../Components/Title";
import Button from "../../Components/Button";
import Label from "../../Components/Label";

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
