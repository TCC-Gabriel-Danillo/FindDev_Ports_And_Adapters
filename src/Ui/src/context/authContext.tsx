import { createContext, useState, useEffect, useCallback } from "react";
import {
  GIT_AUTHORIZATION_ENDPOINT,
  GIT_CLIENT_ID,
  GIT_CLIENT_SECRET,
  GIT_REVOCATION_ENDPOINT,
  GIT_TOKEN_ENDPOINT,
} from "../constants";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { HttpRepositoryImp } from "@infrastructure/repositories";

interface AuthContextProviderProps {
  children: JSX.Element;
}

interface IAuthContext {
  loginWithGithub: () => void;
}

const discovery = {
  authorizationEndpoint: GIT_AUTHORIZATION_ENDPOINT,
  tokenEndpoint: GIT_TOKEN_ENDPOINT,
  revocationEndpoint: GIT_REVOCATION_ENDPOINT,
};

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: GIT_CLIENT_ID,
      scopes: ["identity"],
      redirectUri: makeRedirectUri(),
    },
    discovery
  );

  const loginWithGithub = async () => {
    const response = await promptAsync();
    if (response?.type !== "success") throw new Error("Algo deu errado ao tentar logar.");
  };

  return (
    <AuthContext.Provider value={{ loginWithGithub }}>
      {children}
    </AuthContext.Provider>
  );
};
