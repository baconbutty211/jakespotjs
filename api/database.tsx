import { sql } from 'kysely';
import { createKysely } from '@vercel/postgres-kysely';
// @ts-ignore
import * as schema from './schema.tsx'

function getDatabase(){
    return createKysely<schema.Database>();
}

//#region UserTable
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
export async function upsertUser(user: schema.NewUser) {
    const db = getDatabase();
    const result = await db.insertInto('users')
        .values(user)
        .onConflict((oc) => 
            oc.column('email')
            .doUpdateSet(user)
        )
        .returningAll()
        .execute();

    if (result.length > 1) {
        console.error(`Too many users returned. ${result}`);
        throw new Error(`Too many users returned. ${result}`);
    }
    else if (result.length == 0) {
        console.error(`No users returned. ${result}`);
        throw new Error(`No user with email=${user.email} exists.`);
    }
    else {
        return result[0];
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
export async function findPlayerById(id: number) {
    const db = getDatabase();
    return await db.selectFrom('players')
        .selectAll()
        .where('id', "=", id)
        .execute();
}
export async function findPlayerByGameAndUserIds(user_id: number, game_id: number) {
    if(!game_id) {
        throw new Error("Game Id required");
    }
    else if (!user_id) {
        throw new Error("User Id required");
    }
    else {
        const db = getDatabase();
        const result = await db.selectFrom('players')
            .selectAll()
            .where('user_id', '=', user_id)
            .where('game_id', '=', game_id)
            .execute();
        if(result.length > 1) { // Too many
            console.error('More than one player returned. Something has gone wrong with the SQL query.');
            throw new Error('No unique correct player');
        }
        else if (result.length == 0) { // Not enough
            console.error('No correct player returned. Something has gone wrong in the game logic.');
            throw new Error('No correct player available');
            }
        else { // Just right
            return result[0];
        }
    }
}
export async function findPlayersByGameId(game_id: number) {
    if(game_id) {    
        const db = getDatabase();
        return await db.selectFrom('players')
            .selectAll()
            .where('game_id', "=", game_id)
            .execute();
    }
    else {
        throw new Error("Game Id required");
    }
}
export async function findPlayersByCorrect(game_id: number) {
    if(game_id){    
        const db = getDatabase();
        return await db.selectFrom('players')
        .selectAll()
        .innerJoin('guesses', 'players.id', 'guesses.player_id')
        .where('guesses.is_correct', "=", true)
        .execute();
    }
}
export async function findCorrectPlayerId(game_id: number) {
    if(game_id) {    
        const db = getDatabase();
        const result = await db.selectFrom('songs')
            .select('songs.player_id')
            .innerJoin('games', "songs.id", 'games.current_song_id')
            .where('games.id' , '=', game_id)
            .execute();
        
        if(result.length > 1) { // Too many correct players
            console.error('More than one correct player returned. Something has gone wrong with the SQL query.');
            throw new Error('No unique correct player');
        }
        else if (result.length == 0) { // Not enough correct players
            console.error('No correct player returned. Something has gone wrong in the game logic.');
            throw new Error('No correct player available');
         }
        else { // Just right: 1 correct player
            return result[0].player_id;
        }
    }
    else {
        throw new Error("Game Id required");
    }
}
export async function updatePlayer(update: schema.UpdateablePlayer) {
    if(update.id) {
        const db = getDatabase();
        return db.updateTable('players')
            .set(update)
            .where('id', '=', update.id)
            .returningAll()
            .executeTakeFirst();
    }
}
export async function upsertPlayer(player: schema.NewPlayer) {
    const db = getDatabase();
    const result = await db.insertInto('players')
        .values(player)
        .onConflict((oc) => 
            oc.columns(['user_id', 'game_id'])
            .doUpdateSet(player)
        )
        .returningAll()
        .execute();

    if (result.length > 1) {
        console.error(`Too many players returned. ${result}`);
        throw new Error(`Too many players returned. ${result}`);
    }
    else if (result.length == 0) {
        console.error(`No players returned. ${result}`);
        throw new Error(`No player with user_id=${player.user_id} and game_id=${player.game_id} exists.`);
    }
    else {
        return result[0];
    }
}
export async function incrementPlayerScore(id: number, increment: number = 1) {
    const db = getDatabase();
    return await db.updateTable('players')
        .set((eb) => ({
            score: eb('score', '+', increment)
        }))
        .where('id', '=', id)
        .execute();
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
export async function findSongById(id: number) {
    const db = getDatabase();
    return await db.selectFrom('songs')
        .selectAll()
        .where('id', "=", id)
        .execute();
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
export async function findGameById(id: number) {
    const db = getDatabase();
    const result = await db.selectFrom('games')
        .selectAll()
        .where('id', "=", id)
        .execute();
    if (result.length > 1) {
        console.error(`Too many games returned. ${result}`);
        throw new Error(`Too many games returned. ${result}`);
    }
    else if (result.length == 0) {
        console.error(`No games returned. ${result}`);
        throw new Error(`No game with Id=${id} exists.`);
    }
    else {
        return result[0];
    }
}
export async function updateGame(update: schema.UpdateableGame) {
    if(update.id) {
        const db = getDatabase();
        const result = await db.updateTable('games')
            .set(update)
            .where('id', '=', update.id)
            .returningAll()
            .executeTakeFirst();
        return result as schema.Game;
    }
    else {
        throw new Error(`No game id provided, cannot update game.`)
    }
}
//#endregion


//#region GuessTable
export async function findGuessById(id: number) {
    const db = getDatabase();
    return await db.selectFrom('guesses')
        .selectAll()
        .where('id', "=", id)
        .execute();
}
// Finds ALL players in with Game Id in params.
// Finds ALL guesses of those players where current song Id matches the value in the game record.
/*  SQL query - selects all the latest guesses of current game
SELECT player_id, is_correct FROM guesses
INNER JOIN
(
    SELECT players.id AS id, players.game_id, games.current_song_id AS csi FROM players
    INNER JOIN games
    ON players.game_id = games.id
    WHERE games.id=8
) AS game_players
ON guesses.player_id = game_players.id AND guesses.current_song_id = csi;
*/
export async function findLatestGuessesByGameId(game_id: number) {
    const db = getDatabase();
    const result = await db.selectFrom('guesses')
        .innerJoin(
            (eb) => eb
            .selectFrom('players')
            .innerJoin('games', 'games.id', 'players.game_id')
            .select(['players.id as id', 'players.game_id', 'games.current_song_id as csi'])
            .where('games.id', '=', game_id)
            .as('game_players'),
            (join) => join
            .onRef('guesses.player_id', '=', 'game_players.id')
            .onRef('guesses.current_song_id', '=', 'game_players.csi'),
        )
        .select(['guesses.player_id','guesses.is_correct'])
        .execute();
    return result;
}
export async function upsertGuess(guess: schema.NewGuess) {
    const db = getDatabase();
    const result = await db.insertInto('guesses')
        .values(guess)
        .onConflict((oc) => 
            oc.constraint('guesses_unique')
            .doUpdateSet(guess)
        )
        .returningAll()
        .execute();


    if (result.length > 1) {
        console.error(`Too many guesses returned. ${result}`);
        throw new Error(`Too many guesses returned. ${result}`);
    }
    else if (result.length == 0) {
        console.error(`No guesses returned. ${result}`);
        throw new Error(`No guesses with player_id=${guess.player_id} and current_song_id=${guess.current_song_id} exists.`);
    }
    else {
        return result[0];
    }
}
//#endregion



//#region DATABASE FUNCTIONS

//#region Is Guess Correct SQL
/*
CREATE FUNCTION isGuessCorrect(gameId INT, guessedPlayerId INT) RETURNS BOOLEAN AS 
$BODY$
DECLARE
    correctPlayerId INT;
    isCorrect BOOLEAN;
BEGIN
    SELECT songs.player_id INTO correctPlayerId FROM songs
    JOIN games ON games.current_song_id = songs.id
    WHERE games.id = gameId;

    isCorrect := correctPlayerId = guessedPlayerId;
    RETURN isCorrect;
END;
$BODY$ 
LANGUAGE plpgsql;
*/
//#endregion
export async function isGuessCorrect(game_id: number, guessed_player_id: number) {
    const db = getDatabase();
    //console.log(game_id, guessed_player_id);
    const result: any = await sql`SELECT isGuessCorrect(${game_id}, ${guessed_player_id});`.execute(db);
    
    if(result.rows.length === 1) {
        //console.log(result.rows[0]);
        return result.rows[0].isguesscorrect as boolean;
    }
    else if (result.rows.length === 0) {
        throw new Error (`No results returned from SQL function 'isGuessCorrect(${game_id}, ${guessed_player_id})'`);
    }
    else if (result.rows.length > 1) {
        throw new Error (`Too many results returned from SQL function 'isGuessCorrect(${game_id}, ${guessed_player_id})'`);
    }
    else {
        throw new Error(`Something has gone really wrong. Result returned is null, ${result}`);
    }
}

//#region Get Correct Player Id SQL
/*
CREATE OR REPLACE FUNCTION getCorrectPlayer(gameId int) RETURNS int AS 
$BODY$
DECLARE correctPlayerId int;
BEGIN
    SELECT songs.player_id INTO correctPlayerId FROM songs
    JOIN games ON games.current_song_id = songs.id
    WHERE games.id = gameId;

    RETURN correctPlayerId;
END;
$BODY$
LANGUAGE plpgsql;
*/
//#endregion

//#endregion