import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestDetailsService {

  private baseUrl = 'https://sistema-gb-front.onrender.com/rota';

  constructor(private http: HttpClient) { }

  getRequestDetailsById(id: string): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<any>(url);
  }
}
