import Title from "../../Components/Title";
import CreateGame from "../../Components/CreateGame";
import CreatePlayer from "../../Components/CreatePlayer";


export default function Sandbox() {
    return (
    <>
        <Title>API testing sandbox</Title>
        <br/>
        <CreateGame/>
        <br/>
        <br/>
        <CreatePlayer/>
    </>);
}