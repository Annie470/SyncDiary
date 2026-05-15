import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IUserRegister } from '../../shared/models/user';
import { UserService } from '../../shared/services/user-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private userService = inject(UserService);
  private router = inject(Router);
  loading = signal(false);
  error = signal<string | null>(null);
  form: IUserRegister= {"username": "", password:""};
  confirmedPwd : string = ""

  onSubmit() {
    if (this.form.password !== this.confirmedPwd) {
      this.error.set("Le due password non corrispondono");
      return
    }
    this.userService.register(this.form).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(err.error?.message ?? 'Errore durante la registrazione');
      },
    });

  }
}
