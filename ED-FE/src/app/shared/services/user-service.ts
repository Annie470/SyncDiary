import { Injectable, signal, computed, inject } from '@angular/core';
import { IUserLogin, IUserResponse } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Token } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private tokenKey = 'auth_token';
  private _isLogged = signal<boolean>(this.hasToken());
  private _user = signal<IUserResponse | null>(null);
  private http = inject(HttpClient);
  private apiUrl = `${environment.syD}/sync-diary`;

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  logged(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this._isLogged.set(true);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this._isLogged.set(false);
    this._user.set(null);
  }

  setUser(user: IUserResponse) { this._user.set(user); }
  clearUser() { this._user.set(null); }

  login(payload: IUserLogin) {
    return this.http.post<Token>(`${this.apiUrl}/login`, {
      ...payload,
      platform_name: 'pas',
    });
  }

  getMe() {
    return this.http.get<IUserResponse>(`${this.apiUrl}/me`)
  }

}
