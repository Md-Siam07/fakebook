import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Status } from './status.model';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };
  
  constructor(private http: HttpClient) { }

  getStatus(email:string){
    return this.http.get(environment.apiBaseUrl + '/status' );
  }

  postStatus(postCredentials: any){
    return this.http.post(environment.apiBaseUrl + '/status', postCredentials);
  }
}
