import Button from '../Button';
import { api_uri } from '../../misc';
export default function Python() {
    return (
        <>
            <Button onClick={handlePython}>Do Python</Button>
        </>
    );

    async function handlePython() {
        try{
            const response = await fetch(api_uri + '/python/test-db.py', {
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