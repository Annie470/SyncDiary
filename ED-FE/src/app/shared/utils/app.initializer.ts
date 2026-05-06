import { inject } from '@angular/core';
import { AuthService } from '@shared/services/auth-service';
import { UserService } from '@shared/services/user-service';
import { firstValueFrom, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export async function initializeApp() {
  const authService = inject(AuthService);
  const userService = inject(UserService);
  const token = localStorage.getItem('auth_token');

  if (!token) return;

  try {
    const user = await firstValueFrom(
      userService.getMe().pipe(
        switchMap(user => //SWITCHMAP: PRIMA CHIAMATA GET/ME/DATABENC E POI GET/ME/PAS, SE ADMIN NO GET/ME/PAS
          user.isAdmin
            ? of(user)
            : userService.getMePas().pipe(map(userPas => ({ ...user, ...userPas })))
        )
      )
    );
    authService.setUser(user);
  } catch {
    authService.logout();
  }
}