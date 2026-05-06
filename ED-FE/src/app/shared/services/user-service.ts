import { Injectable, signal, computed, inject } from '@angular/core';
import { IUserLogin, IUserResponse } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Token } from '../models/token';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private tokenKey = 'auth_token';
  private _isLogged = signal<boolean>(this.hasToken());
  private _user = signal<IUserResponse | null>(null);
  private http = inject(HttpClient);
  private authUrl = `${environment.syD}/sync-diary/auth`;
  private apiUrl = `${environment.syD}/sync-diary`;

  isLogged = computed(() => this._isLogged());

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this._isLogged.set(false);
    this._user.set(null);
  }

  setUser(user: IUserResponse) { this._user.set(user); }
  clearUser() { this._user.set(null); }

  async login(payload: IUserLogin) {
    const tokenResponse = await firstValueFrom(
      this.http.post<Token>(`${this.authUrl}/login`, payload)
    );
    localStorage.setItem(this.tokenKey, tokenResponse.access_token);
    this._isLogged.set(true);
  }

  getMe() {
    return this.http.get<IUserResponse>(`${this.apiUrl}/me`);
  }
}
