export const api_uri : string = IsDevMode() ? import.meta.env.VITE_DEV_API_URI : import.meta.env.VITE_PRODUCT_API_URI;
export const redirect_uri : string = IsDevMode() ? import.meta.env.VITE_DEV_REDIRECT_URI : import.meta.env.VITE_PRODUCT_REDIRECT_URI;

function IsDevMode(){
    //console.log( import.meta.env.MODE === 'development' ? import.meta.env.VITE_DEV_REDIRECT_URI : import.meta.env.VITE_PRODUCT_REDIRECT_URI );
    return import.meta.env.MODE === 'development';
}

export function GetRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}


