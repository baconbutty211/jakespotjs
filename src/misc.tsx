export const api_uri : string = IsDevMode() ? import.meta.env.VITE_DEV_API_URI : import.meta.env.VITE_PRODUCTION_API_URI;
export const redirect_uri : string = IsDevMode() ? import.meta.env.VITE_DEV_REDIRECT_URI : import.meta.env.VITE_PRODUCTION_REDIRECT_URI;
export const client_id : string = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
export const client_secret : string = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;


function IsDevMode(){
    //console.log(import.meta.env.MODE)
    return import.meta.env.MODE === 'development';
}

export function GetRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}


