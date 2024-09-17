import Title from "../../components/Title";
import Hello from "../../components/Sandbox/Hello";
import CreateGame from "../../components/Sandbox/CreateGame";
import CreatePlayer from "../../components/Sandbox/CreatePlayer";
import RetrievePlayers from "../../components/Sandbox/RetrievePlayers";
import UpsertGuess from "../../components/Sandbox/UpsertGuess";
import { UpdateState } from "../../components/Sandbox/UpdateGame";
import LogsContainer from "../../components/LogsContainer";
import RetrieveUser from "../../components/Sandbox/RetrieveUser";

export default function Sandbox() {
    return (
    <>
        <Title>API testing sandbox</Title>
        <br/>
        <Hello/>
        <br/>
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