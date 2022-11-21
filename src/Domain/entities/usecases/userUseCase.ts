import { User } from "../models"

export interface UserUseCase {
    getUser(username: string): Promise<User>
    createUser(user: User): Promise<void>
    listUsers(): Promise<Array<User>>
}
