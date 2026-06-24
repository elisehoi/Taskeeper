import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAuthService } from './user-auth.service';
import { ItemsService } from './items.service';
import { Item } from './item';
import { Observable, Subject } from 'rxjs';

const API_BASE_URL = "https://127.0.0.1:52409/api/v1/";

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  private subject = new Subject<void>();
  onSyncFinished: Observable<void> = this.subject;

  constructor(
    private readonly itemsService: ItemsService, 
    private readonly userAuthService: UserAuthService, 
    private readonly httpClient: HttpClient) {}

  async sync() : Promise<string> {

    const json_web_token = UserAuthService.getJwt();

    const httpOptions: any = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'x-access-token': json_web_token
      }),
      responseType: 'json',
    };

    let errorMessage = "";
    errorMessage = await this.sendPostRequests(httpOptions);
    errorMessage = await this.sendGetRequest(httpOptions);

    let statusMessage = this.getStatusMessage(errorMessage);

    return statusMessage;
  }

  async sendPostRequests(httpOptions: any) : Promise<string> {
  
    const items = await this.itemsService.items.toArray();

    console.log("Sending POST requests ...");
    let errorMessage = "";

    for (let item of items) {
      let object = { "item_id": item.item_id, "title": item.title, "is_active": item.is_active }
      console.log(object);
  
      try {
        let response: any;
        response = await this.httpClient.post(API_BASE_URL + 'items', object, httpOptions).toPromise();
        
      } catch(error) {
        // when trying to add an already existing item, a duplicate key error occurs - issue PUT request in this case
        if (error.error.startsWith("error: duplicate key value")) {
          await this.httpClient.put(API_BASE_URL + 'items/' + item.item_id, object, httpOptions).toPromise();
        } else {
          errorMessage = error.error;
          console.log(error.error);
        }
      }
    }

    return errorMessage;
  }
  
  async sendGetRequest(httpOptions: any) : Promise<string> {
    
    console.log("Sending GET request ...");
    let errorMessage = "";

    try {

      let newItems: any;
      newItems = await this.httpClient.get<Item[]>(API_BASE_URL + 'items', httpOptions).toPromise();

      console.log(newItems);
      this.itemsService.items.bulkPut(newItems);

      this.subject.next();

    } catch(error) {
      errorMessage = error.error;
      console.log(error);
    }

    return errorMessage;
  }
  
  getStatusMessage(errorMessage: string) : string{
    
    let date = new Date();
    let timestamp = date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0') + ":" + date.getSeconds().toString().padStart(2, '0');

    let statusMessage = "";
    if (!errorMessage) {
      statusMessage = timestamp + " " + "synchronized";
    } else {
      statusMessage = timestamp + " " + errorMessage;
    }
    return statusMessage;
  }

}
