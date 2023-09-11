import Button from '../Button';
import { api_uri } from '../../misc';
import { useCookies } from 'react-cookie';


export default function RetrieveUser() {
    const [cookies, SetCookie] = useCookies(['user_id']);
    return(
        <>
            <Button onClick={handleRetrieveUser}>Retrieve User</Button>
        </>
    )
  
    async function handleRetrieveUser() {
        const userData = await fetch(api_uri + '/retrieve-user.tsx', {
        method: "POST",
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ id: cookies.user_id })
        });
        if (userData.ok) {
            const user = await userData.json()
            console.log(user);
        }
        else {
            throw new Error('Failed to retrieve user data.')
        }
  }
}