import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../services/user-service';

export async function initializeApp() {
  const userService = inject(UserService);
  const token = localStorage.getItem('auth_token');

  if (!token) return;

  try {
    const user = await firstValueFrom(userService.getMe());
    userService.setUser(user);
  } catch {
    userService.logout();
  }
}