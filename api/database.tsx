import { createKysely } from '@vercel/postgres-kysely';
// @ts-ignore
import { Database, UpdateableUser, User, NewUser } from './schema'

function getDatabase(){
    return createKysely<Database>();
}

//#region UserTable
export async function createUser(user: NewUser) {
    const db = getDatabase();
    return await db.insertInto('users')
        .values(user)
        .returningAll()
        .executeTakeFirstOrThrow();
}
export async function findUsers() {
    const db = getDatabase();
    return await db.selectFrom('users')
        .selectAll()
        .execute();
}
export async function findUserById(id: number) {
    const db = getDatabase();
    return await db.selectFrom('users')
        .selectAll()
        .where('id', "=", id)
        .execute();
}
export async function findUserByEmail(email: string) {
    const db = getDatabase();
    return await db.selectFrom('users')
        .selectAll()
        .where('email', "=", email)
        .execute();
}
export async function findLastUser() {
    const db = getDatabase();
    return await db.selectFrom('users')
        .selectAll()
        .orderBy('id', 'desc')
        .limit(1)
        .execute();
}
export async function updateUser(email: string, update: UpdateableUser) {
    const db = getDatabase();
    db.updateTable('users')
    .set(update)
    .where('email', '=', email)
    .executeTakeFirst();
}
//#endregion
