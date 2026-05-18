import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IUserRegister } from '../../shared/models/user';
import { UserService } from '../../shared/services/user-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private userService = inject(UserService);
  private router = inject(Router);
  loading = signal(false);
  error = signal<string | null>(null);
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  form: IUserRegister= {"username": "", password:""};
  confirmedPwd : string = ""

  onSubmit() {
    if (!this.form.username.trim()) {
      this.error.set("L'username non può essere vuoto");
      return;
    }
    if (!this.form.password) {
      this.error.set("La password non può essere vuota");
      return;
    }
    if (this.form.password !== this.confirmedPwd) {
      this.error.set("Le due password non corrispondono");
      return;
    }
    this.loading.set(true);
    this.userService.register(this.form).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(err.error?.detail ?? 'Errore durante la registrazione');
      },
    });

  }
}
