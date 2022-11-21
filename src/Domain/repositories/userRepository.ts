import { User } from "../entities/models";

export interface UserRepository {
    createUser(user: User): Promise<void>
    getUser(username: string): Promise<User>
    listlUser(): Promise<Array<User>>
}