import Title from "../../Components/Title";
import CreateGame from "../../Components/Sandbox/CreateGame";
import CreatePlayer from "../../Components/Sandbox/CreatePlayer";
import RetrievePlayers from "../../Components/Sandbox/RetrievePlayers";
import UpsertGuess from "../../Components/Sandbox/UpsertGuess";
import { UpdateState } from "../../Components/Sandbox/UpdateGame";
import LogsContainer from "../../Components/LogsContainer";
import RetrieveUser from "../../Components/Sandbox/RetrieveUser";

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