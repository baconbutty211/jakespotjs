import { createKysely } from '@vercel/postgres-kysely';
// @ts-ignore
import { Database, UserUpdate, User, NewUser } from './schema'

function getDatabase(){
    return createKysely<Database>();
}

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

export async function findLastUser() {
    const db = getDatabase();
    return await db.selectFrom('users')
        .selectAll()
        .orderBy('id', 'desc')
        .limit(1)
        .execute();
}