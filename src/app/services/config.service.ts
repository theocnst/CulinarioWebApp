import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private apiUrl!: string;

  constructor(private http: HttpClient) {
    //local api
    //this.apiUrl = 'https://localhost:7053/api';
    //production api
    this.apiUrl = 'https://culinarioapi.azurewebsites.net/api';
  }

  getConfig() {
    return {
      apiUrl: this.apiUrl,
    };
  }
}
