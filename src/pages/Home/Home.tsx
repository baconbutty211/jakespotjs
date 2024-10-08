import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import Title from "../../components/Title";

export default function Home() {
    const navigate = useNavigate();

    return (
    <>
        <Title> Home </Title>
        <Button onClick={HandleJakeSpot}>JakeSpot</Button>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <Button onClick={HandleSandbox} visible={false}> </Button>
    </>);

    function HandleJakeSpot() {
        navigate('/Landing');
    }

    function HandleSandbox() {
        navigate('/Sandbox');
    }
}
