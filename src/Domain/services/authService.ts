import {
  AuthToken,
  AuthUseCase,
  Credentials,
} from "../entities/usecases/authUseCase";
import { AuthRepository, HttpRepository } from "../repositories";

export class AuthService implements AuthUseCase {
  private authRepository: AuthRepository;
  private gitAuth: HttpRepository;
  private oAuthToken?: AuthToken;

  constructor(gitAuth: HttpRepository, authRepository: AuthRepository) {
    this.gitAuth = gitAuth;
    this.authRepository = authRepository
  }

  public setOAuthToken = async (credentials: Credentials) => {
    this.oAuthToken = await this.gitAuth.post<AuthToken>(
      "/access_token",
      credentials,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
  };
  
  public signInWithCredentials = async () => {
    const token = this.getOAuthToken() || ''
    return this.authRepository.signInWithCredentials(token);
  }

  public getOAuthHeader = () => {
    return {
      headers: { authorization: `Bearer ${this.oAuthToken?.access_token}` },
    };
  };
  
  public getOAuthToken= () => {
    return this.oAuthToken?.access_token
  }

}
