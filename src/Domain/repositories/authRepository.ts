import { UserCredential } from "@domain/entities";

export interface AuthRepository {
  signInWithCredentials: (token: string) => Promise<UserCredential>;
}