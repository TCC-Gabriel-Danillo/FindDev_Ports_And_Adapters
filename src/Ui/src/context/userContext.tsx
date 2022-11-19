import { createContext, useState, useEffect } from "react"
import { Alert } from "react-native"
import { Position, User, UserUseCase, AuthUseCase } from "@domain/entities"
import { GitRepository, GitUser } from "@infrastructure/dto"
import { HttpRepository } from "@domain/repositories"


interface IUserContext {
    users: Array<User>,
    isLoading: boolean, 
    addUser: (username: string, position: Position) => Promise<boolean>
}

interface UserContextProps {
    children: JSX.Element
    userService: UserUseCase
    httpRepository: HttpRepository
    authService: AuthUseCase
}

export const UserContext = createContext<IUserContext>({} as IUserContext); 

export function UserContextProvider({ 
    children, 
    userService, 
    authService,
    httpRepository }: UserContextProps){
    
    const [users, setUsers] = useState<Array<User>>([]);
    const [isLoading, setIsLoadig] = useState(false); 
    
    useEffect(() => {
       (
       async () => {
            const response = await userService.listUsers()
            setUsers(response)
       }
       )()
    }, [])

    const addUser = async (username: string, position: Position): Promise<boolean> => {
        try {
            setIsLoadig(true)

            const authHeader = authService.getOAuthHeader()

            const promises = [
                httpRepository.get<GitUser>(`/users/${username}`, authHeader),
                httpRepository.get<Array<GitRepository>>(`/users/${username}/repos`, authHeader),
            ]

            const [responseUser, responseRepos,_] = await Promise.all(promises); 
            
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
                profileUrl: user.html_url
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

    return (
        <UserContext.Provider value={{ users, isLoading, addUser }}>
            {children}
        </UserContext.Provider>
    )
}

