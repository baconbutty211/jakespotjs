// AuthContext.tsx
import React, { ProviderProps, createContext, useContext, useEffect, useState } from 'react';
import { useSpotify } from '../hooks/UseSpotify';
import { client_id, redirect_uri } from '../misc';
import { Scopes, SpotifyApi, AccessToken } from '@spotify/web-api-ts-sdk';
import * as api from "../requests/Backend";
import { useCookies } from 'react-cookie';

interface AuthContextProps {
    children: React.ReactNode;
}
interface AuthHookProps extends ProviderProps<any> {
    sdk: SpotifyApi;
    accessToken: AccessToken;
}

// Context Initialization
export const AuthContext = createContext<null | any>(null);

// Context Provider
export function AuthProvider({ children } : AuthContextProps) {
    //const scopes : string[] = [];
    //scopes.concat(Scopes.playlistRead, Scopes.userDetails, Scopes.userPlaybackModify, Scopes.userPlaybackRead, Scopes.userPlayback);
    //const [sdk, loading] = useSpotify(client_id, redirect_uri, scopes);
    const [sdk, loading] = useSpotify(client_id, redirect_uri, Scopes.all);
    const [accessToken, setAccessToken] = useState<AccessToken | null>(null);
    const [tokenExpiry, setTokenExpiry] = useState<number | null>(null);
    const [cookies, setCookie] = useCookies(['user_id', 'access_token', 'refresh_token']);


    useEffect(() => {
        let interval: NodeJS.Timeout;
        async function fetchTokenAndScheduleRefresh() {
            if (sdk) {
                // Fetch access token and user profile
                const token = await sdk.getAccessToken();
                const user_profile = await sdk.currentUser.profile();
                setAccessToken(token);

                // Update user data in the database
                const userData = await api.UpsertUser(user_profile.email, token?.access_token, token?.refresh_token, user_profile.id);
                setCookie("user_id", userData.id);
                setCookie("access_token", token?.access_token);
                setCookie("refresh_token", token?.refresh_token);

                // Calculate time until token expiration
                if (token && token.expires_in) {
                    const refreshTime = token.expires_in * 1000; // ms
                    interval = setTimeout(fetchTokenAndScheduleRefresh, refreshTime);
                    
                    // Set token expiry time
                    const expiry = Date.now() + refreshTime;
                    setTokenExpiry(expiry);
                }
            }
        }

        // Refresh token when (tab becomes visible or window gains focus) and token has expired
        function handleVisibilityOrFocus() {
            if (!tokenExpiry || (Date.now() > tokenExpiry)) {
                fetchTokenAndScheduleRefresh();
            }
        }

        // Initial fetch and setup
        fetchTokenAndScheduleRefresh();
        window.addEventListener('focus', handleVisibilityOrFocus);
        document.addEventListener('visibilitychange', handleVisibilityOrFocus);

        return () => {
            if (interval) clearTimeout(interval);
            window.removeEventListener('focus', handleVisibilityOrFocus);
            document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
        };
    }, [sdk]);

    return loading
        ? <img aria-placeholder='Loading Spotify API... Imagine a spinwheel'/>
        : <AuthContext.Provider value={{ sdk, accessToken }}>{children}</AuthContext.Provider>;
};


// Context Consumer
export function useAuth() : AuthHookProps {
    return useContext(AuthContext);
};