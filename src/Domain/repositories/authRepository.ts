import { Credentials } from "../entities/usecases/authUseCase";

export interface AuthRepository {
  setOAuthToken: (credentials: Credentials) => void;
  getOAuthHeader: () => any;
}