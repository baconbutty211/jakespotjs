import Button from "../../components/Button";

import { redirect_uri, GetRandomInt } from "../../misc";
import { useSpotify } from "../../hooks/UseSpotify";
import { AccessToken, Artist, Artists, ItemTypes, Scopes, SearchResults, SpotifyApi, UserProfile } from "@spotify/web-api-ts-sdk";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import * as api from "../../requests/Backend";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

const queryParams = new URLSearchParams(window.location.search);
const state = queryParams.get("state"); // Created in the authorization step
const authCode = queryParams.get("code");
export default function Login() {
    const {sdk} = useAuth();
    return sdk ? (<SpotifyUser sdk={sdk}/>) : (<></>); 
}

function SpotifyUser( { sdk }: { sdk: SpotifyApi }) {
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['user_id', 'access_token', 'refresh_token']);
    const [profile, setProfile] = useState<UserProfile>({} as UserProfile);
    //const [token, setToken] = useState<AccessToken | null>(null);

    useEffect(() =>{
        (async () => {
            const results = await sdk.currentUser.profile();
            const token: AccessToken | null = await sdk.getAccessToken(); 
            setProfile(() => results);   
            // Upsert user
            console.log(results);
            setCookie("access_token", token?.access_token);
            setCookie("refresh_token", token?.refresh_token);
            const userData = await api.UpsertUser(token?.access_token, token?.refresh_token, results.id);
            setCookie("user_id", userData.id);
        })();
    }, [sdk]);
    
    navigate('/');
    return (<> </>);
}

function SpotifySearch({ sdk }: { sdk: SpotifyApi}) {
  const [results, setResults] = useState<SearchResults<ItemTypes[]>>({} as SearchResults<ItemTypes[]>);

  useEffect(() => {
    (async () => {
      const results = await sdk.search("The Beatles", ["artist"]);
      setResults(() => results);      
    })();
  }, [sdk]);

  // generate a table for the results
  const tableRows = results.artists?.items.map((artist: Artist) => {
    return (
      <tr key={artist.id}>
        <td>{artist.name}</td>
        <td>{artist.popularity}</td>
        <td>{artist.followers.total}</td>
      </tr>
    );
  });

  return (
    <>
      <h1>Spotify Search for The Beatles</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Popularity</th>
            <th>Followers</th>
          </tr>
        </thead>
        <tbody>
          {tableRows}
        </tbody>
      </table>
    </>
  )
}