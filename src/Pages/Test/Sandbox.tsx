import Title from "../../Components/Title";
import CreateGame from "../../Components/Sandbox/CreateGame";
import CreatePlayer from "../../Components/Sandbox/CreatePlayer";
import { UpdateState } from "../../Components/Sandbox/UpdateGame";
import LogsContainer from "../../Components/LogsContainer";

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
        <UpdateState/>
        <br/>
        <br/>
        <h4>Logs: </h4>
        <LogsContainer />
    </>);
}