import { Injectable, signal, computed, inject } from '@angular/core';
import { IUserLogin, IUserRegister, IUserResponse } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Token } from '../models/token';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private tokenKey = 'auth_token';
  private _isLogged = signal<boolean>(this.hasToken());
  private _user = signal<IUserResponse | null>(null);
  private http = inject(HttpClient);
  private authUrl = `${environment.syD}/sync-diary/auth`;

  isLogged = computed(() => this._isLogged());

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this._isLogged.set(false);
    this._user.set(null);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this._isLogged.set(true);
  }

  setUser(user: IUserResponse) { this._user.set(user); }

  clearUser() { this._user.set(null); }

  login(payload: IUserLogin): Observable<Token> {
    return this.http.post<Token>(`${this.authUrl}/login`, payload);
  }
  register(payload: IUserRegister):  Observable<IUserResponse> {
    return this.http.post<IUserResponse>(`${this.authUrl}/register`, payload)
  }

  getMe() {
    return this.http.get<IUserResponse>(`${this.authUrl}/me`);
  }
}
