import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { switchMap, tap } from 'rxjs/operators';
import { IUserLogin } from '../../shared/models/user';
import { UserService } from '../../shared/services/user-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private userService = inject(UserService);
  private router = inject(Router);
  loading = signal(false);
  error = signal<string | null>(null);
  credentials: IUserLogin = { username: '', password: '' };

  onSubmit(): void {
    this.loading.set(true);
    this.error.set(null);

    this.userService.login(this.credentials).pipe(
      tap(response => this.userService.saveToken(response.access_token)),
      switchMap(() => this.userService.getMe())
    ).subscribe({
      next: (user) => {
        this.userService.setUser(user);
        this.loading.set(false);
        this.router.navigate(['/homepage']);
      },
      error: (err: HttpErrorResponse) => {
        this.userService.logout();
        this.loading.set(false);
        this.error.set(err.error?.detail ?? 'Errore durante il login');
      },
    });
  }
}
