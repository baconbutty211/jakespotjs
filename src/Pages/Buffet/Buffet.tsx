import PlaylistCard from "../../components/PlaylistCard";
import Title from "../../components/Title";
import { GetUserPlaylists } from "../../requests/Spotify/Playlist";
import { SpotifyWebApi } from "spotify-web-api-ts";
import { useState } from "react";

export default function Buffet() {
  const image_size: number = 1;
  const [playlists, setPlaylists] = useState([]);

  GetUserPlaylists()
    .then((playlists) => setPlaylists(playlists.items))
    .catch(err => console.error(err));
  
  return (
    <>
      <Title>Buffet</Title>
      <div className="card-deck"> {
        
          playlists.map((playlist: any, index: number) => (
            <PlaylistCard 
              key={index}
              onClick={() => handleSelectPlaylist(playlist.uri)}
              img={{
                src: playlist.images[playlist.images.length > 1 ? image_size : 0].url,
                alt: "playlist image", 
                height: 60,
                width: 60,
              }}
              title={playlist.name}
              text={`${playlist.description}`}
            />
          ))
        }
      </div>
    </>
  );


  function handleSelectPlaylist(playlist_uri: string) {
  
  }
}
