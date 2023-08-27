import { createKysely } from '@vercel/postgres-kysely';
// @ts-ignore
import * as schema from './schema'

function getDatabase(){
    return createKysely<schema.Database>();
}

//#region UserTable
export async function createUser(user: schema.NewUser) {
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
export async function updateUser(update: schema.UpdateableUser) {
    if(update.email){
        const db = getDatabase();
        db.updateTable('users')
            .set(update)
            .where('email', '=', update.email)
            .executeTakeFirst();
    }
}
//#endregion


//#region PlayerTable
export async function createPlayer(player: schema.NewPlayer) {
    const db = getDatabase();
    return await db.insertInto('players')
        .values(player)
        .returningAll()
        .executeTakeFirstOrThrow();
}
export async function findPlayers() {
    const db = getDatabase();
    return await db.selectFrom('players')
        .selectAll()
        .execute();
}
export async function findPlayerById(id: number) {
    const db = getDatabase();
    return await db.selectFrom('players')
        .selectAll()
        .where('id', "=", id)
        .execute();
}
export async function findLastPlayer() {
    const db = getDatabase();
    return await db.selectFrom('players')
        .selectAll()
        .orderBy('id', 'desc')
        .limit(1)
        .execute();
}
export async function updatePlayer(update: schema.UpdateablePlayer) {
    if(update.id) {
        const db = getDatabase();
        db.updateTable('players')
            .set(update)
            .where('id', '=', update.id)
            .executeTakeFirst();
    }
}
//#endregion


//#region SongTable
export async function createSong(song: schema.NewSong) {
    const db = getDatabase();
    return await db.insertInto('songs')
        .values(song)
        .returningAll()
        .executeTakeFirstOrThrow();
}
export async function findSongs() {
    const db = getDatabase();
    return await db.selectFrom('songs')
        .selectAll()
        .execute();
}
export async function findSongById(id: number) {
    const db = getDatabase();
    return await db.selectFrom('songs')
        .selectAll()
        .where('id', "=", id)
        .execute();
}
export async function findLastSong() {
    const db = getDatabase();
    return await db.selectFrom('songs')
        .selectAll()
        .orderBy('id', 'desc')
        .limit(1)
        .execute();
}
export async function updateSong(update: schema.UpdateableSong) {
    if(update.id) {
        const db = getDatabase();
        db.updateTable('songs')
            .set(update)
            .where('id', '=', update.id)
            .executeTakeFirst();
    }
}
//#endregion


//#region GameTable
export async function createGame(game: schema.NewGame) {
    const db = getDatabase();
    return await db.insertInto('games')
        .values(game)
        .returningAll()
        .executeTakeFirstOrThrow();
}
export async function findGames() {
    const db = getDatabase();
    return await db.selectFrom('games')
        .selectAll()
        .execute();
}
export async function findGameById(id: number) {
    const db = getDatabase();
    return await db.selectFrom('games')
        .selectAll()
        .where('id', "=", id)
        .execute();
}
export async function findLastGame() {
    const db = getDatabase();
    return await db.selectFrom('games')
        .selectAll()
        .orderBy('id', 'desc')
        .limit(1)
        .execute();
}
export async function updateGame(update: schema.UpdateableGame) {
    if(update.id) {
        const db = getDatabase();
        db.updateTable('games')
            .set(update)
            .where('id', '=', update.id)
            .executeTakeFirst();
    }
}
//#endregion


//#region GuessTable
export async function createGuess(guess: schema.NewGuess) {
    const db = getDatabase();
    return await db.insertInto('guesses')
        .values(guess)
        .returningAll()
        .executeTakeFirstOrThrow();
}
export async function findGuesss() {
    const db = getDatabase();
    return await db.selectFrom('guesses')
        .selectAll()
        .execute();
}
export async function findGuessById(id: number) {
    const db = getDatabase();
    return await db.selectFrom('guesses')
        .selectAll()
        .where('id', "=", id)
        .execute();
}
export async function findLastGuess() {
    const db = getDatabase();
    return await db.selectFrom('guesses')
        .selectAll()
        .orderBy('id', 'desc')
        .limit(1)
        .execute();
}
export async function updateGuess(update: schema.UpdateableGuess) {
    if(update.id) {
        const db = getDatabase();
        db.updateTable('guesses')
            .set(update)
            .where('id', '=', update.id)
            .executeTakeFirst();
    }
}
//#endregion