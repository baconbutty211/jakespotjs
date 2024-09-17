import Button from '../Button';
import * as api from '../../requests/Backend';
import { useCookies } from 'react-cookie';


export default function RetrieveUser() {
    const [cookies, SetCookie] = useCookies(['user_id']);
    return(
        <>
            <Button onClick={handleRetrieveUser}>Retrieve User</Button>
        </>
    )
  
    async function handleRetrieveUser() {
        const user = await api.RetrieveUser(cookies.user_id); 
        console.log(user);
  }
}