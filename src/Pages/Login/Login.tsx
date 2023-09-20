import Button from "../../components/Button";

import { redirect_uri, GetRandomInt } from "../../misc";
import { SpotifyWebApi } from "spotify-web-api-ts";

const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const client_secret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const spotify_web_api = new SpotifyWebApi({clientId: client_id, clientSecret: client_secret, redirectUri: redirect_uri});

import { useAuth } from "../../contexts/AuthContext";

const queryParams = new URLSearchParams(window.location.search);
const state = queryParams.get("state"); // Created in the authorization step
const authCode = queryParams.get("code");
export default function Login() {
    //  If userContext is already logged in:
    //      return ( User already logged in, Logout button )
    //  If authcode is in Url params:
    //      Login with userContext
    //  Else:
    //      return ( Login button )

    const user = useAuth();
    console.log(user);
    if ( user.is_logged_in ) {
        return (
            <>
                <p>User Logged in</p>
                <Button onClick={user.logout}> Logout of Spotify </Button>
            </>
        );
    }
    else if ( authCode ) {
        user.login(authCode);
        return (
            <>
                <p>User Logged in</p>
                <Button onClick={user.logout}> Logout of Spotify </Button>
            </>
        )
    }
    else {
        return <Button onClick={getAuthCode}>Login to Spotify</Button>;
    }
}


async function getAuthCode() {
    const state = GetRandomInt(1e16).toString();
    sessionStorage.setItem("state", state);

    const url: string = spotify_web_api.getRefreshableAuthorizationUrl({ 
        scope: ["user-read-email", "user-read-private"], 
        state: state, 
        show_dialog: true
    });
    window.location.href = url;
}