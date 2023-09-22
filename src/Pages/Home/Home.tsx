import Button from "../../components/Button";
import { Navigate } from "react-router-dom";
import Title from "../../components/Title";

export default function Home() {
    return (
    <>
        <Title> Home </Title>
        <Button onClick={HandleOnClick}>JakeSpot</Button>
    </>);
}

function HandleOnClick() {
    window.location.href = "/Landing";
}