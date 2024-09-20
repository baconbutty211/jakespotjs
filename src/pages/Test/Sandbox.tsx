import Title from "../../components/Title";
import Python from "../../components/Sandbox/Python";
import CreateGame from "../../components/Sandbox/CreateGame";
import CreatePlayer from "../../components/Sandbox/CreatePlayer";
import RetrievePlayers from "../../components/Sandbox/RetrievePlayers";
import UpsertGuess from "../../components/Sandbox/UpsertGuess";
import { UpdateState } from "../../components/Sandbox/UpdateGame";
import LogsContainer from "../../components/LogsContainer";
import RetrieveUser from "../../components/Sandbox/RetrieveUser";
import UpsertUser from "../../components/Sandbox/UpsertUser";
import { useCookies } from "react-cookie";
import SpotifyPlayer from 'react-spotify-web-playback';


export default function Sandbox() {
    const [cookies, setCookies] = useCookies(["access_token"])
    return (
    <>
        <Title>API testing sandbox</Title>
        <br/>
        <Python/>
        <br/>
        <br/>
        <SpotifyPlayer token={cookies.access_token} uris={['spotify:track:3aeWRywNZ1PkEFqBG5wwkH']} 
        styles={{
            activeColor: '#fff',
            bgColor: '#333',
            color: '#fff',
            loaderColor: '#fff',
            sliderColor: '#1cb954',
            trackArtistColor: '#ccc',
            trackNameColor: '#fff',
        }}/>;
        <br/>
        <br/>
        <UpsertUser/>
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