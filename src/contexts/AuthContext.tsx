// AuthContext.tsx
import React, { ProviderProps, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import { SpotifyWebApi } from 'spotify-web-api-ts';
import { redirect_uri } from '../misc';

interface AuthContextProps {
    children: React.ReactNode;
}
interface AuthHookProps extends ProviderProps<any> {
    is_logged_in: boolean,
    access_token?: string | null,
    login: (authcode: string) => void,
    logout: () => void,
    refresh: () => void,
}


const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const client_secret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const spotify_web_api = new SpotifyWebApi({clientId: client_id, clientSecret: client_secret, redirectUri: redirect_uri});
export function AuthProvider({ children } : AuthContextProps) {
    //const [interval, _setInterval] = useState(3600000);
    const [cookies, setCookies] = useCookies(['access_token', 'refresh_token']);

    
    const login = (authCode: string) => {
        let interval: number;
        console.log(spotify_web_api)

        // Initial user authentication of Spotify API 
        spotify_web_api.getRefreshableUserTokens(authCode).then((tokens) => {
            console.log(`Successsfully logged in to Spotify.`)
            console.log(tokens);
            interval = tokens.expires_in; // Sets intial countdown interval
            
            setCookies("access_token", tokens.access_token);
            setCookies("refresh_token", tokens.refresh_token);
        })
        .catch((error) => {
            console.error("Failed to log in to Spotify");
            console.error(error);
        });
    };

    const logout = () => {
        setCookies("access_token", null);
        setCookies("refresh_token", null);
    };

    async function refreshAccessToken() {
         // Refreshes the user's access token
        try {
            const result = await spotify_web_api.getRefreshedAccessToken(cookies.refresh_token)
            setCookies("access_token", result.access_token);
        }
        catch (error) {
            console.error("Failed to refresh access token");
            console.error(error);
        }
    }
    

    const user = useMemo(() => ({
        is_logged_in: cookies.refresh_token !== null,
        access_token: cookies.access_token,
        login,
        logout,
        refreshAccessToken
    }), [cookies.access_token, cookies.refresh_token]);
    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

const AuthContext = createContext<null | any>(null);
export function useAuth() : AuthHookProps {
    return useContext(AuthContext);
};