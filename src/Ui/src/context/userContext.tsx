import { createContext, useState } from "react"
import { Alert } from "react-native"
import { ListUserParams, Position, User, UserUseCase } from "@domain/entities"
import { GitRepository, GitUser } from "@infrastructure/dto"
import { HttpRepository } from "@domain/repositories"

interface IUserContext {
    isLoading: boolean, 
    addUser: (username: string, position: Position) => Promise<boolean>
    listUsers: (listUserParams: ListUserParams) => Promise<User[]>
}

interface UserContextProps {
    children: JSX.Element
    userService: UserUseCase
    httpRepository: HttpRepository
    geohashGeneratorHelper: Function
}

export const UserContext = createContext<IUserContext>({} as IUserContext); 

export function UserContextProvider({ 
    children, 
    userService, 
    httpRepository,
    geohashForLocation }: UserContextProps){
    
    const [isLoading, setIsLoadig] = useState(false); 
    
    const addUser = async (username: string, position: Position): Promise<boolean> => {
        try {
            setIsLoadig(true)

            const promises = [
                httpRepository.get<GitUser>(`/${username}`),
                httpRepository.get<Array<GitRepository>>(`/${username}/repos`)
            ]

            const [responseUser, responseRepos] = await Promise.all(promises); 
            
            const user  = responseUser as unknown as GitUser
            const userRepos = responseRepos as unknown as Array<GitRepository>

            const techs: Array<string> = []

            userRepos.forEach(repo => {
                const isNewTech = !techs.find((tech) => repo.language == tech)
                if(isNewTech && repo.language){
                    techs.push(repo.language)
                }
            })

            const newUser: User = {
                email: user.email, 
                id: user.id, 
                phoroUrl: user.avatar_url, 
                techs: techs, 
                position: position, 
                username: user.login, 
                profileUrl: user.html_url,
                geohash: geohashForLocation([position.latitude, position.longitude])
            }

            await userService.addUser(newUser)

            setIsLoadig(false)
            return true
        } catch(error) {
            setIsLoadig(false)
            if(error instanceof Error) Alert.alert(error.message)
            return false
        }
    }

    const listUsers = async (listUserParams: ListUserParams) => {
        const response = await userService.listUsers(listUserParams)
        return response;
    };

    return (
        <UserContext.Provider value={{ listUsers, isLoading, addUser }}>
            {children}
        </UserContext.Provider>
    )
}

