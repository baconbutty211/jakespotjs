import Button from '../Button';
import { GetApiUri } from '../../misc';
export default function Python() {
    return (
        <>
            <Button onClick={handlePython}>Do Python</Button>
        </>
    );

    async function handlePython() {
        try{
            const uri = GetApiUri('test-db');
            const response = await fetch(uri, {
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