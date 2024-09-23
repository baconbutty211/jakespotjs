// AuthContext.tsx
import React, { ProviderProps, createContext, useContext } from 'react';
import { useSpotify } from '../hooks/UseSpotify';
import { client_id, redirect_uri } from '../misc';
import { Scopes, SpotifyApi, User } from '@spotify/web-api-ts-sdk';

interface AuthContextProps {
    children: React.ReactNode;
}
interface AuthHookProps extends ProviderProps<any> {
    sdk: SpotifyApi;
}

// Context Initialization
export const AuthContext = createContext<null | any>(null);

// Context Provider
export function AuthProvider({ children } : AuthContextProps) {
    let scopes : string[] = [];
    scopes = scopes.concat(Scopes.playlistRead, Scopes.userDetails, Scopes.userPlaybackModify, Scopes.userPlaybackRead, Scopes.userPlayback);
    const [sdk, loading] = useSpotify(client_id, redirect_uri, Scopes.all);
    return loading ? <img aria-placeholder='Loading Spotify API... Imagine a spinwheel'/> : <AuthContext.Provider value={{sdk: sdk}}>{children}</AuthContext.Provider>;
};

// Context Consumer
export function useAuth() : AuthHookProps {
    return useContext(AuthContext);
};