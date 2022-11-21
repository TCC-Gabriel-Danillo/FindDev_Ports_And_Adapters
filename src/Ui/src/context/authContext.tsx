import { createContext, useCallback } from "react";
import {
  GIT_AUTHORIZATION_ENDPOINT,
  GIT_CLIENT_ID,
  GIT_CLIENT_SECRET,
  GIT_REVOCATION_ENDPOINT,
  GIT_TOKEN_ENDPOINT,
  APP_SCHEME,
  STORAGE_KEYS,
} from "../constants";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { AuthService } from "@domain/services";
import { User, UserCredential } from "@domain/entities";
import { LocalStorageRepository } from "@domain/repositories";
import { usePersistentState } from "../hooks";


WebBrowser.maybeCompleteAuthSession();

interface AuthContextProviderProps {
  children: JSX.Element;
  authService: AuthService;
  localStorage: LocalStorageRepository
}

interface IAuthContext {
  signInWithGithub: () => Promise<UserCredential>;
  isUserAuthenticated: boolean;
  user: User;
}

const discovery = {
  authorizationEndpoint: GIT_AUTHORIZATION_ENDPOINT,
  tokenEndpoint: GIT_TOKEN_ENDPOINT,
  revocationEndpoint: GIT_REVOCATION_ENDPOINT,
};

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthContextProvider = ({
  children,
  authService,
  localStorage
}: AuthContextProviderProps) => {
  const { value: user } = usePersistentState<User>(STORAGE_KEYS.USERS, localStorage)

  const [,, promptAsync] = useAuthRequest(
    {
      clientId: GIT_CLIENT_ID,
      scopes: ["identity"],
      redirectUri: makeRedirectUri({
        scheme: APP_SCHEME,
      }),
    },
    discovery
  );

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

  return (
    <AuthContext.Provider value={{ signInWithGithub, isUserAuthenticated: !!user?.id, user }}>
      {children}
    </AuthContext.Provider>
  );
};
