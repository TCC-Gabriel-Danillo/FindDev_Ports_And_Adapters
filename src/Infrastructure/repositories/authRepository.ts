import {
  GithubAuthProvider,
  getAuth,
  signInWithCredential,
} from "firebase/auth";
import { AuthRepository } from "../../domain/repositories/authRepository";

export class AuthRepositoryImp implements AuthRepository {
  signInWithCredentials(token: string) {
    const credential = GithubAuthProvider.credential(token);
    const auth = getAuth();

    return signInWithCredential(auth, credential);
  }
}
