// AuthContext.tsx
import React, { ProviderProps, createContext, useContext } from 'react';
import { useSpotify } from '../hooks/UseSpotify';
import { client_id, redirect_uri } from '../misc';
import { Scopes, SpotifyApi } from '@spotify/web-api-ts-sdk';

interface AuthContextProps {
    children: React.ReactNode;
}
interface AuthHookProps extends ProviderProps<any> {
    is_loggged_in: boolean;
    sdk: SpotifyApi | null;
}

// Context Initialization
export const AuthContext = createContext<null | any>(null);

// Context Provider
export function AuthProvider({ children } : AuthContextProps) {
    const [sdk, loading] = useSpotify(client_id, redirect_uri, Scopes.all);
    return loading ? <img placeholder='Loading Spotify API... Imagine a spinwheel'/> : <AuthContext.Provider value={{is_logged_in: sdk != null, sdk: sdk}}>{children}</AuthContext.Provider>;
};

// Context Consumer
export function useAuth() : AuthHookProps {
    return useContext(AuthContext);
};