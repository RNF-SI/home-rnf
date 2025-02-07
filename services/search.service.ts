import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from 'src/conf/app.config';

export interface SearchItem {
  slug: string;
  nom: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  getSearchItems(apiUrl: string): Observable<SearchItem[]> {
    return this.http.get<SearchItem[]>(AppConfig.API_ENDPOINT + apiUrl);
  }
}
