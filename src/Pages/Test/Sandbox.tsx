import Button from "../../Components/Button";
import Title from "../../Components/Title";
import * as backend from "../../../api/database";
import * as schema from "../../../api/schema";
import { api_uri } from '../../misc'

async function CreateGame() {
    const newGame = await fetch(api_uri + '/Create/Game', {
        method: "POST",
      }); 
    newGame.json().then((data) => { console.log(data);})
}

export default function Sandbox() {
    return (
    <>
        <Title>API testing sandbox</Title>
        <Button onClick={CreateGame}>Create Game</Button>
    </>);
}