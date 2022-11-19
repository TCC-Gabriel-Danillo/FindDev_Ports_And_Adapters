import { createContext, useCallback } from "react";
import {
  GIT_AUTHORIZATION_ENDPOINT,
  GIT_CLIENT_ID,
  GIT_CLIENT_SECRET,
  GIT_REVOCATION_ENDPOINT,
  GIT_TOKEN_ENDPOINT,
  GITHUB_URL,
} from "../constants";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as WebBrowser from 'expo-web-browser';
import { AuthService } from "@domain/services";

WebBrowser.maybeCompleteAuthSession();

interface AuthContextProviderProps {
  children: JSX.Element;
  authService: AuthService;
}

interface IAuthContext {
  loginWithGithub: () => Promise<void>;
}

const discovery = {
  authorizationEndpoint: GIT_AUTHORIZATION_ENDPOINT,
  tokenEndpoint: GIT_TOKEN_ENDPOINT,
  revocationEndpoint: GIT_REVOCATION_ENDPOINT,
};

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthContextProvider = ({ children, authService }: AuthContextProviderProps) => {
  const [,, promptAsync] = useAuthRequest(
    {
      clientId: GIT_CLIENT_ID,
      scopes: ["identity"],
      redirectUri: makeRedirectUri({
        scheme: 'APP_SCHEME'
      }),
    },
    discovery
  );

  const loginWithGithub = useCallback(async () => {
    const response = await promptAsync();
  
    if (response?.type !== "success")
      throw new Error("Algo deu errado ao tentar logar.");

    const oAuthCredentials = {
      ...response.params,
      client_id: GIT_CLIENT_ID,
      client_secret: GIT_CLIENT_SECRET,
    };
    
    await authService.setOAuthToken(oAuthCredentials)

  }, [promptAsync]);

  return (
    <AuthContext.Provider value={{ loginWithGithub }}>
      {children}
    </AuthContext.Provider>
  );
};
