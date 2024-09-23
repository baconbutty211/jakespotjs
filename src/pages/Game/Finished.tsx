import Scoring from "./Scoring";
import * as schema from "../../requests/Schema";


interface Props {
    players: schema.Player[],
    cookies: {
        user_id?: string,
        game_id?: string,
        host?: boolean,
    }
  }
export default function Finished({players, cookies}: Props) {
    let best_player: schema.Player = {id: -1, user_id: -1, game_id: -1, spotify_playlist_id: "", score: -1, image:"", username: "Doesn't Exist"};
    players.forEach((player) => {
        if(player.score > best_player.score) 
            best_player = player;
    });
    return (<>
        <Scoring players={players} cookies={cookies} final={true}/>
        <h2> Congratulations {best_player.username} won with a score of: {best_player.score} </h2>
    </>)
}