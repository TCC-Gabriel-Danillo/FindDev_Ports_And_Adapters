import { createContext, useState, useEffect } from "react"
import { Alert } from "react-native"
import { Position, User, UserUseCase, AuthUseCase, UserCredential } from "@domain/entities"
import { GitRepository, GitUser } from "@infrastructure/dto"
import { HttpRepository } from "@domain/repositories"

interface IUserContext {
    users: Array<User>,
    addUser: (allowedUser: UserCredential, position: Position) => Promise<boolean>
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
    
    useEffect(() => {
       (
       async () => {
            const response = await userService.listUsers()
            setUsers(response)
       }
       )()
    }, [])

    const addUser = async (allowedUser: UserCredential, position: Position): Promise<boolean> => {
        try {
                const authHeader = authService.getOAuthHeader()

                const responseUser = await httpRepository.get<GitUser>(`/search/users?q=${allowedUser.user.email}`, authHeader)
                const user = responseUser?.items[0];

                const userRepos = await httpRepository.get<Array<GitRepository>>(`/users/${user?.login}/repos`, authHeader)
                const techs: Array<string> = []

                userRepos?.forEach(repo => {
                    const isNewTech = !techs.find((tech) => repo.language == tech)
                    if(isNewTech && repo.language){
                        techs.push(repo.language)
                    }
                })

                if (user) {
                const newUser: User = {
                    email: allowedUser.user.email || undefined , 
                    id: user?.id, 
                    phoroUrl: user.avatar_url, 
                    techs: techs, 
                    position: position, 
                    username: user.login, 
                    profileUrl: user.html_url
                }

                await userService.addUser(newUser)
            }

            return true
        } catch(error) {
            if(error instanceof Error) Alert.alert(error.message)
            return false
        }
    }

    return (
        <UserContext.Provider value={{ users, addUser }}>
            {children}
        </UserContext.Provider>
    )
}

