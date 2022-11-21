import { createContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import {
  Position,
  User,
  UserUseCase,
  AuthUseCase,
  UserCredential,
} from "@domain/entities";
import { GitRepository, GitUser } from "@infrastructure/dto";
import { HttpRepository, LocalStorageRepository} from "@domain/repositories";
import { usePersistentState } from "../hooks";
import { STORAGE_KEYS } from "../constants";

interface IUserContext {
  users: Array<User>;
  createUser: (
    allowedUser: UserCredential,
    position: Position
  ) => Promise<boolean>;
  updateUser: (user: User) => Promise<void>
}

interface UserContextProps {
  children: JSX.Element;
  userService: UserUseCase;
  githubApi: HttpRepository;
  localStorage: LocalStorageRepository;
  authService: AuthUseCase;
}

export const UserContext = createContext<IUserContext>({} as IUserContext);

export function UserContextProvider({
  children,
  userService,
  authService,
  githubApi,
  localStorage
}: UserContextProps) {
  const [users, setUsers] = useState<Array<User>>([]);
  const { setPersistentState } = usePersistentState(STORAGE_KEYS.USERS, localStorage, {});

  useEffect(() => {
    (async () => {
      const response = await userService.listUsers();
      setUsers(response);
    })();
  }, []);

  const createUser = async (
    allowedUser: UserCredential,
    position: Position
  ): Promise<boolean> => {
    try {
      const authHeader = authService.getOAuthHeader();

      const responseUser = (await githubApi.get<GitUser>(
        `/search/users?q=${allowedUser.user.email}`,
        authHeader
      )) as GitUser;

      const user = responseUser.items[0];

      const userRepos = await githubApi.get<Array<GitRepository>>(
        `/users/${user?.login}/repos`,
        authHeader
      );
      const techs: Array<string> = [];

      userRepos?.forEach((repo) => {
        const isNewTech = !techs.find((tech) => repo.language == tech);
        if (isNewTech && repo.language) {
          techs.push(repo.language);
        }
      });

      updateUser({
        email: allowedUser.user.email || undefined,
        id: user.id,
        phoroUrl: user.avatar_url,
        techs: techs,
        position: position,
        username: user.login,
        profileUrl: user.html_url,
      });

      return true;

    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
      return false
    }
  };

  const updateUser =async (user: User) => {
    const newUser: User = {
      ...user
    };
    
    setPersistentState(newUser);
    await userService.createUser(newUser);
  }

  return (
    <UserContext.Provider value={{ users, createUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}
