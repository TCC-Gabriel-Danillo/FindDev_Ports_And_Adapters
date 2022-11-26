import { createContext } from "react";
import { Alert } from "react-native";
import {
  Position,
  User,
  UserUseCase,
  AuthUseCase,
  UserCredential,
  ListUserParams
} from "@domain/entities";
import { GitRepository, GitUser } from "@infrastructure/dto";
import { HttpRepository, LocalStorageRepository} from "@domain/repositories";
import { usePersistentState } from "../hooks";
import { STORAGE_KEYS } from "../constants";

interface IUserContext {
  createUser: (
    allowedUser: UserCredential,
    position: Position,
    ) => Promise<User|undefined>;
  listUsers: (listUserParams: ListUserParams) => Promise<User[]>;
  updateUser: (user: User) => Promise<User>;
}

export interface UserContextProps {
  children?: JSX.Element;
  userService: UserUseCase;
  githubApi: HttpRepository;
  localStorage: LocalStorageRepository;
  geohashGenerator: Function
  authService: AuthUseCase;
}

export const UserContext = createContext<IUserContext>({} as IUserContext);

export function UserContextProvider({
  children,
  userService,
  authService,
  githubApi,
  localStorage,
  geohashGenerator
}: UserContextProps) {
  const { setPersistentState } = usePersistentState(STORAGE_KEYS.USERS, localStorage, {});

  const createUser = async (
    allowedUser: UserCredential,
    position: Position
  ): Promise<User|undefined> => {
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

      const newUser = updateUser({
        email: allowedUser.user.email || undefined,
        id: user.id,
        photoUrl: user.avatar_url,
        techs: techs,
        position: position,
        username: user.login,
        profileUrl: user.html_url,
      } as User);

      return newUser;

    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
    }
  };

  const updateUser = async (user: User) => {
    const newUser: User = {
      ...user,
      geohash: geohashGenerator(user.position)
    };

    setPersistentState(newUser);
    await userService.createUser(newUser);
    return newUser
  }

  const listUsers = async (listUserParams: ListUserParams) => {
    const response = await userService.listUsers(listUserParams)
    return response;
  };

  return (
    <UserContext.Provider value={{ createUser, updateUser, listUsers }}>
      {children}
    </UserContext.Provider>
  );
}
