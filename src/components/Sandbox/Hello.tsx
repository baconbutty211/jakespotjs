import Button from '../Button';
import { api_uri } from '../../misc';
import { CreateGame as createGame } from '../../requests/Backend';

export default function Hello() {
    return (
        <>
            <Button onClick={handleHello}>Get Hello</Button>
        </>
    );

    async function handleHello() {
        try{
            const response = await fetch(api_uri + '/hello.py', {
                method: "POST"
            }); 
            if (response.ok) {
                console.log(response.body);
            }
        }
        catch (error) {
            console.error(error);
        }
    }
}