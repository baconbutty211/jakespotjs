import * as schema from "../../../api/node/schema";
import * as api from "../../requests/Backend";
import Button from "../../components/Button";

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
        <table>
            <thead> 
                <tr>
                    <th>Player</th>
                    <th>Score</th>
                </tr>
            </thead>
            <tbody>
                {players.map((player) => (
                    <tr key={player.id}>
                        <td>{player.id}</td>
                        <td>{player.score}</td>
                    </tr> 
                ))}
            </tbody>
        </table>
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