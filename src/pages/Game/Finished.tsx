import Scoring from "./Scoring";
import * as schema from "../../../api/node/schema";


interface Props {
    players: schema.Player[],
    cookies: {
        user_id?: string,
        game_id?: string,
        host?: boolean,
    }
  }
export default function Finished({players, cookies}: Props) {
    return (<>
        <h2> Congratulations ___ won with a score of: NotImplemented </h2>
        <Scoring players={players} cookies={cookies} final={true}/>
    </>)
}