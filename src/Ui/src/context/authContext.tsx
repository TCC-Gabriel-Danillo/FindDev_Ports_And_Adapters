import { createContext, useCallback } from "react";
import {
  GIT_CLIENT_ID,
  GIT_CLIENT_SECRET,
  STORAGE_KEYS,
} from "../constants";
import * as WebBrowser from "expo-web-browser";
import { AuthService } from "@domain/services";
import { User, UserCredential } from "@domain/entities";
import { LocalStorageRepository } from "@domain/repositories";
import { useAuthRequestType, usePersistentState } from "../hooks";


WebBrowser.maybeCompleteAuthSession();

interface AuthContextProviderProps {
  children: JSX.Element;
  authService: AuthService;
  localStorage: LocalStorageRepository;
  promptAsync: () => Promise<useAuthRequestType['response']>
}

interface IAuthContext {
  signInWithGithub: () => Promise<UserCredential>;
  isUserAuthenticated: boolean;
  signOut: () => void;
  user?: User;
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthContextProvider = ({
  children,
  authService,
  localStorage,
  promptAsync
}: AuthContextProviderProps) => {
  const { value: user, setPersistentState } = usePersistentState<User>(STORAGE_KEYS.USERS, localStorage)

  const signInWithGithub = useCallback(async () => {
    const response = await promptAsync();
    
    if (response?.type !== "success")
    throw new Error("Algo deu errado ao tentar logar.");
    
    const oAuthCredentials = {
      ...response.params,
      client_id: GIT_CLIENT_ID,
      client_secret: GIT_CLIENT_SECRET,
    };

    await authService.setOAuthToken(oAuthCredentials);
    
    return authService.signInWithCredentials();
  }, [promptAsync]);

  const signOut = () => {
    setPersistentState({} as User);
  };

  return (
    <AuthContext.Provider value={{ signInWithGithub, isUserAuthenticated: !!user?.id, user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
