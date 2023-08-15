import { Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface Database {
    users: UserTable
}

export interface UserTable {
    id: Generated<number>,

    email: string,
    accesstoken: string | null,
    refreshtoken: string | null,
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UpdateableUser = Updateable<UserTable>;