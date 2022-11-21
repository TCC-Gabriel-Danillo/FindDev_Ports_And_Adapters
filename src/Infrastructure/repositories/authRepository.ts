import { GithubAuthProvider, getAuth, signInWithCredential } from "../../ui/node_modules/@firebase/auth";
import { AuthRepository } from "../../domain/repositories/authRepository";

export class AuthRepositoryImp implements AuthRepository {
  signInWithCredentials(token: string) {
    const credential = GithubAuthProvider.credential(token);
    const auth = getAuth();
    
    return signInWithCredential(auth, credential)
  }
}