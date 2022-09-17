import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Story } from './story.model';

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  constructor(private http: HttpClient) { }

  postStory(story: Story, image: File){
    var formData: any = new FormData();
    formData.append('fullName', story.fullName);
    formData.append('email', story.email);
    formData.append('image', image);
    for (var pair of formData.entries()) {
      console.log(pair[0]+ ', ' + pair[1]); 
    }
    return this.http.post(environment.apiBaseUrl+'/story', formData);
  }

  fetchStories(email: String){
    return this.http.get(environment.apiBaseUrl + '/story/' + email);
  }

  getObject(url: String){
    return this.http.get(environment.apiBaseUrl + '/story/image/' + url);
  }
}
