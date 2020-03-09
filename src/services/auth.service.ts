import { Injectable } from "@angular/core";
import { CredenciaisDTO } from "../models/Credenciais.dto";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../config/api.config";
import { LocalUser } from "../models/local_user";
import { StorageService } from "./storage.service";

@Injectable()
export class AuthService{

  constructor(public http: HttpClient, public storage: StorageService){

  }

  authenticate(creds : CredenciaisDTO){
    return this.http.post(`${API_CONFIG.baseUrl}/login`,
    creds,
    {
      observe: 'response',
      responseType: 'text' //para evitar error jsonParse
    });
  }

  successfulLogin(authorizationValue : string){
    let tok = authorizationValue.substring(7) //para pegar token sem a palavra bearer
    let user : LocalUser = {
      token : tok
    };
    this.storage.setLocalUser(user);
  }
  logout(){
    this.storage.setLocalUser(null);
  }
}
