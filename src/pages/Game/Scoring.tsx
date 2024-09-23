import * as schema from "../../requests/Schema";
import * as api from "../../requests/Backend";
import Button from "../../components/Button";
import { GameScoringPlayerTable } from "../../components/PlayerTable";

interface Props {
    players: schema.Player[],
    cookies: {
        user_id?: string,
        game_id?: string,
        host?: boolean,
    },
    final?: boolean,
  }
  

export default function Scoring({ players, cookies, final=false }: Props) {
    return (<>
        <h2>Scores</h2>
        <GameScoringPlayerTable players={players}/>
        <br/>
        
        { cookies.host && !final ? <Button onClick={handleContinue}>Continue playing</Button> : <></> }
        { cookies.host && !final ? <Button onClick={handleFinish}>Finished playing</Button> : <></> }
    </>)

    async function handleContinue() {
        api.UpdateGame(parseInt(cookies.game_id ? cookies.game_id : ""), "guessing");
    }
    async function handleFinish() {
        api.UpdateGame(parseInt(cookies.game_id ? cookies.game_id : ""), "finished");
    }
}