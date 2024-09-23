import * as schema from "../requests/Schema";
import { LobbyPlayerRow, GameGuessingPlayerRow, GameScoringPlayerRow } from "./PlayerRow";
import Button from "../components/Button";

interface Props {
    players: schema.Player[],
}

interface GameGuessingProps extends Props {
    selectedPlayerId: number,
    onGuessCallback: (guessed_player_id: number) => void,
}


export function LobbyPlayerTable({ players }: Props) {
    return (<>
        <h3> Players: </h3>
        <table>
            <thead> 
                <tr>
                    <th> Image </th>
                    <th> Name </th>
                </tr>
            </thead>
            <tbody>
                {players.map((player) => <LobbyPlayerRow key={player.id} player={player}></LobbyPlayerRow>)}
            </tbody>
        </table> 
    </>)
}

export function GameGuessingPlayerTable({ players, selectedPlayerId, onGuessCallback }: GameGuessingProps) {
    return (<>
        <table>
            <thead> 
                <tr>
                    <th> Image </th>
                    <th> Name </th>
                    <th> Guess </th>
                </tr>
            </thead>
            <tbody>
                {players.map((player) => <GameGuessingPlayerRow key={player.id} player={player} guessed={player.id == selectedPlayerId} onGuessCallback={onGuessCallback}></GameGuessingPlayerRow>)}
            </tbody>
        </table> 
    </>)
}

export function GameScoringPlayerTable({ players }: Props) {
    return (<>
        <table>
            <thead> 
                <tr>
                    <th> Image </th>
                    <th> Name </th>
                    <th> Score </th>
                </tr>
            </thead>
            <tbody>
                {players.map((player) => <GameScoringPlayerRow key={player.id} player={player}></GameScoringPlayerRow>)}
            </tbody>
        </table> 
    </>)
}
