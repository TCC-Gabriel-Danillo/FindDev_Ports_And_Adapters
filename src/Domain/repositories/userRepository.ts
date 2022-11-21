import { ListUserParams, User } from "../entities/models";

export interface UserRepository {
    addUser(user: User): Promise<void>
    getUser(username: string): Promise<User>
    listUsers(listUserParams: ListUserParams): Promise<Array<User>>
}