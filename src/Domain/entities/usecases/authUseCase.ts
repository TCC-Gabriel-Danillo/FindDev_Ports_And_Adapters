import { UserCredential as UserCredentialGithub } from "firebase/auth";

export interface UserCredential extends UserCredentialGithub {}

export interface Credentials {
  client_id: string;
  client_secret: string;
  [key: string]: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  scope: string;
}

type oAuthHeader = {
  headers: { authorization: string };
};

export interface AuthUseCase {
  setOAuthToken: (credentials: Credentials) => Promise<void>;
  getOAuthHeader: () => oAuthHeader;
  getOAuthToken: () => string|undefined;
  signInWithCredentials: () => Promise<UserCredential>
}
