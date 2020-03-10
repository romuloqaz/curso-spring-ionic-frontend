import { Injectable } from "@angular/core";
import { CredenciaisDTO } from "../models/Credenciais.dto";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../config/api.config";
import { LocalUser } from "../models/local_user";
import { StorageService } from "./storage.service";
import { JwtHelper } from 'angular2-jwt';


@Injectable()
export class AuthService{

  jwtHelper : JwtHelper = new JwtHelper();

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

  refreshToken() {
    return this.http.post(
        `${API_CONFIG.baseUrl}/auth/refresh_token`,
        {},//TOKEN INCLUIDO NO INTERCEPTOR
        {
            observe: 'response',
            responseType: 'text'
        });
}

  successfulLogin(authorizationValue : string){
    let tok = authorizationValue.substring(7) //para pegar token sem a palavra bearer
    let user : LocalUser = {
      token : tok,
      email : this.jwtHelper.decodeToken(tok).sub
    };
    this.storage.setLocalUser(user);
  }
  logout(){
    this.storage.setLocalUser(null);
  }
}
