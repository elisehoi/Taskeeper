import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { UserService } from './user.service';

const API_BASE_URL = "https://127.0.0.1:52445/api/v1/";

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  private static jwt: string = "";

  constructor(
    private readonly httpClient: HttpClient) 
    { }

  public async login(userName: string, password: string) {

    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      }),
      responseType: 'text',
    };
    
    try { //logs with the userservice
      UserService.logIn(userName, password)
    } catch(error: any){
      console.log(error.message);
      throw new Error(error.message);
    }
    
    let object = { "userName": userName, "password": password }; //I don't know if this part is necessary...

    try {
      let response: any = await this.httpClient.post<string>(API_BASE_URL + "login", object, httpOptions).toPromise();
      UserAuthService.jwt = response;
      
    } catch(error: any) {
      console.log(error.message);
      throw new Error(error.message);
    }
  }

  public async createAccount( firstName: string, lastName: string, userName: string, emailAdress: string, password: string) {
    
    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      }),
      responseType: 'text',
    };

    try {
     var newUser = UserService.newUser(firstName, lastName, userName, emailAdress, password)
     var uD: String = '';
     for (let usedDevice of newUser.usedDevices){
      uD= uD+usedDevice+","; //device model is stored as a string
     }
    } catch(error: any){
      throw new Error(error.message) //is supposed to catch the error message in case the username already exists 
    }
    let object = {
      "firstName": newUser.firstName,
      "lastName": newUser.lastName,
      "userName": newUser.userName,
      //"userID": newUser.userID, //is it necessary to convert the number here?
      "emailAdress": newUser.emailAdress,
      "password": newUser.password, // TO DO: store as hash if not automatically done already 
      //"usedDevices": uD, // string separated by commas for now
       //To-Do: configure database to store tables (arrays of objects)

      //"loggedIn": newUser.loggedIn,

      //empty as default 
      //To-Do: configure database to store tables (arrays of objects)
      //"fullToDolist": "", 
      //"projectsList": "", 
      //"teams": ""
    };
    try {
      let response: any = await this.httpClient.post<string>(API_BASE_URL + "register", object, httpOptions).toPromise(); 
    } catch(error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  public static getJwt(): string {
    return UserAuthService.jwt;
  }
}
