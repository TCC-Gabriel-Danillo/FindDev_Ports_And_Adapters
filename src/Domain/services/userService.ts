import { ListUserParams, User } from "../entities/models";
import { UserUseCase } from "../entities/usecases";
import { UserRepository } from "../repositories";

export class UserService implements UserUseCase {
    constructor(
        private userRepository:UserRepository, 
    ){}

    getUser(username: string): Promise<User> {
        return this.userRepository.getUser(username);
    }

    createUser(user: User): Promise<void> {
        return this.userRepository.createUser(user); 
    }

    listUsers(listUserParams: ListUserParams): Promise<User[]> {
        return this.userRepository.listUsers(listUserParams);
    }

}