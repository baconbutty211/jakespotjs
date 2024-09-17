import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import Title from "../../components/Title";

export default function Home() {
    const navigate = useNavigate();

    return (
    <>
        <Title> Home </Title>
        <Button onClick={HandleOnClick}>JakeSpot</Button>
    </>);

    function HandleOnClick() {
        navigate('/Landing');
    }
}
