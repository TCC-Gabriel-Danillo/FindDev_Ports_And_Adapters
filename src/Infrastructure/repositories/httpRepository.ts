
import { HttpRepository } from "../../domain/repositories";
import axios, { AxiosInstance, AxiosError } from "axios"; 
import { NotFoundError, ServerError } from "../erros/http"


const headers = {
    'Content-Type': 'application/json'
};

export class HttpRepositoryImp implements HttpRepository {
    api: AxiosInstance;
    constructor(baseURL: string){
        this.api = axios.create({
            baseURL, 
            headers
        })
    }
    async get <T>(endpoint: string, params?: Record<string, any>, config?: any): Promise<T | undefined> {
        try {
            const response = await this.api.get(endpoint, { ...config, params });
            return response.data as T;
        } catch(error){
            if( error instanceof AxiosError){
                if(error.response?.status == 404) throw new NotFoundError()
                if(error.response?.status == 500) throw new ServerError()
            }
        }
    }
    
    async post <T>(endpoint: string, data?: Record<string, any>, config?: any): Promise<T | undefined> {
        try {
            const response = await this.api.post(endpoint, data, { ...config  });
            return response.data as T;
        } catch(error){
            if( error instanceof AxiosError){
                if(error.response?.status == 404) throw new NotFoundError()
                if(error.response?.status == 500) throw new ServerError()
            }
        }
    }
}