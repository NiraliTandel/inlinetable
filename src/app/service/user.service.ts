import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiLink: string;

  constructor(private http: HttpClient) {
    this.apiLink = environment.baseURL;
  }

  public createUser(userData: User): Observable<User> {
    return this.http.post<User>(`${this.apiLink}/users`, userData);
  }

  public getUserList(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiLink}/users`);
  }

  public updateUser(id: number, userData: User): Observable<User> {
    return this.http.put<User>(`${this.apiLink}/users/${id}`, userData);
  }

  public deleteUser(id: number | undefined): Observable<number> {
    return this.http.delete<number>(`${this.apiLink}/users/${id}`);
  }
}
