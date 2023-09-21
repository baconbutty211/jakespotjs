import Title from "../../components/Title.tsx";
import CreateGame from "../../components/Sandbox/CreateGame.tsx";
import CreatePlayer from "../../components/Sandbox/CreatePlayer.tsx";
import RetrievePlayers from "../../components/Sandbox/RetrievePlayers.tsx";
import UpsertGuess from "../../components/Sandbox/UpsertGuess.tsx";
import { UpdateState } from "../../components/Sandbox/UpdateGame.tsx";
import LogsContainer from "../../components/LogsContainer.tsx";
import RetrieveUser from "../../components/Sandbox/RetrieveUser.tsx";

export default function Sandbox() {
    return (
    <>
        <Title>API testing sandbox</Title>
        <br/>
        <CreateGame/>
        <br/>
        <br/>
        <CreatePlayer/>
        <br/>
        <br/>
        <RetrievePlayers/>
        <br/>
        <br/>
        <RetrieveUser/>
        <br/>
        <br/>
        <UpsertGuess/>
        <br/>
        <br/>
        <UpdateState/>
        <br/>
        <br/>
        <h4>Logs: </h4>
        <LogsContainer />
    </>);
}