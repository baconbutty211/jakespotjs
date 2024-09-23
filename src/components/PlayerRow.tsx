import * as schema from "../requests/Schema";
import Button from "./Button";

interface Props {
    player: schema.Player,
    guessed?: boolean,
    onGuessCallback?: (guessed_player_id: number) => void
  }
  


export function LobbyPlayerRow({ player }: Props) {
    return (
        <tr key={player.id}>
            <td><img src={player.image}></img></td>
            <td>{player.username}</td>
        </tr>
    )
}

export function GameGuessingPlayerRow({ player, guessed, onGuessCallback }: Props) {
    return (
        <tr key={player.id}>
            <td><img src={player.image}></img></td>
            <td>{player.username}</td>
            <td>
                <Button 
                    disabled={guessed} 
                    color={guessed ? "secondary" : "success"}
                    onClick={() => onGuessCallback ? onGuessCallback(player.id) : Error("No callback passed to GameGuessingPlayerRow")}> 
                    Guess
                </Button>
            </td>
        </tr>
    )
}

export function GameScoringPlayerRow({ player }: Props) {
    return (
        <tr key={player.id}>
            <td><img src={player.image}></img></td>
            <td>{player.username}</td>
            <td>{player.score}</td>
        </tr> 
    )
}