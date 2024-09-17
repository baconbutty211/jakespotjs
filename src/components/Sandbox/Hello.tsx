import Button from '../Button';
import { api_uri } from '../../misc';
export default function Hello() {
    return (
        <>
            <Button onClick={handleHello}>Get Hello</Button>
        </>
    );

    async function handleHello() {
        try{
            const response = await fetch(api_uri + '/python/hello.py', {
                method: "GET"
            }); 
            if (response.ok) {
                console.log(await response.text());
            }
        }
        catch (error) {
            console.error(error);
        }
    }
}