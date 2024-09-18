import Button from '../Button';
import { useCookies } from 'react-cookie';
import * as api from '../../requests/Backend';


export default function UpsertUser() {
    const [cookies, SetCookie] = useCookies(['user_id', 'game_id', 'player_id']);
    return (
        <>
            <Button onClick={handleUpsertUser}>Upsert User</Button>
        </>
    );

    async function handleUpsertUser() {
        const user = await api.UpsertUser("token", "refresh", "sui");
        SetCookie('user_id', user.id);
        console.log(user);
    }
}