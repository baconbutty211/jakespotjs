import { useEffect, useState } from "react";
import { MaxInt, Playlist, SpotifyApi, User } from "@spotify/web-api-ts-sdk";
import { useAuth } from "../../contexts/AuthContext";

import * as api from "../../requests/Backend";

import Title from "../../components/Title";
import PlaylistCard from "../../components/PlaylistCard";
import { Navigate, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";


async function GetUserPlaylists(api: SpotifyApi) {
    const limit: MaxInt<50> = 50;
    const offset: number = 0; 
    try {
        const profile = await api?.currentUser.profile() as User;

        const results = await api?.playlists.getUsersPlaylists(profile.id, limit, offset);
        const playlists: Playlist[] = results?.items as Playlist[]; // If User has 50+ playlists, this only returns MAX 50 playlists. 
        return playlists;
    }
    catch (e: Error | unknown) {
        const error = e as Error;
        if (error && error.message && error.message.includes("No verifier found in cache")) {
            console.error("If you are seeing this error in a React Development Environment it's because React calls useEffect twice. Using the Spotify SDK performs a token exchange that is only valid once, so React re-rendering this component will result in a second, failed authentication. This will not impact your production applications (or anything running outside of Strict Mode - which is designed for debugging components).", error);
        } 
        else {
            console.error(e);
        }
    }
}

export default function Buffet() {
    const image_size: number = 1;
    const navigate = useNavigate();
    const [cookies, SetCookie] = useCookies(['user_id', 'game_id', 'player_id']);
    
    const [playlists, setPlaylists] = useState<Playlist[]>([] as Playlist[]);
    const { sdk: spotify_api } = useAuth();
    
    useEffect(() => {
        GetUserPlaylists(spotify_api)
        .then((playlists) => setPlaylists(playlists as Playlist[]))
        .catch((error: Error) => console.error(error));
    }, []);

    return (
        <>
        <Title>Buffet</Title>
        <div className="card-columns"> {
            
            playlists.map((playlist: Playlist, index: number) => (
                <PlaylistCard 
                    key={index}
                    onClick={() => handleSelectPlaylist(playlist)}
                    img={{
                        src: playlist.images[playlist.images.length > 1 ? image_size : 0].url,
                        alt: "playlist image", 
                        height: 160,
                        width: 160,
                    }}
                    title={playlist.name}
                    //text={`${playlist.description}`}
                    footer={`Contains ${playlist.tracks.total} songs`}
                />
            ))
            }
        </div>
        </>
    );


    async function handleSelectPlaylist(playlist: Playlist) {

        // Upsert player
        const playlist_id = playlist.uri.split(':')[2]; // Extract the playlist ID from the URI
        const playerData = await api.UpsertPlayer(cookies.user_id, cookies.game_id, playlist_id);
        // Set random song for player
        try {
            const tracks = await spotify_api.playlists.getPlaylistItems(playlist_id); // Fetch the first item to ensure the playlist exists
            console.log(tracks);
            const random_track = tracks.items[Math.floor(Math.random() * tracks.total)];
            await api.UpsertSong(playerData.id, random_track.track.id);
        } catch (error: any) {
            console.error('Error setting player random song:', error);
        }
        
        // Set player_id cookie
        SetCookie("player_id", playerData.id); 
        // Redirect to lobby
        navigate("/Lobby");
    }
}
