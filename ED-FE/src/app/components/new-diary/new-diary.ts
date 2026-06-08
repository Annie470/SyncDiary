import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DiaryService } from '../../shared/services/diary-service';
import { IDiaryRequest } from '../../shared/models/diary';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-diary',
  imports: [FormsModule],
  templateUrl: './new-diary.html',
  styleUrl: './new-diary.css',
})
export class NewDiary {
  private diaryService = inject(DiaryService);
  private router = inject(Router);
  loading = signal(false);
  error = signal<string | null>(null);
  form: IDiaryRequest = { text: '' };

  cancel(): void {
    this.router.navigate(['/homepage']);
  }

  onSubmit(): void {
    this.loading.set(true);
    this.diaryService.createDiary(this.form).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/homepage']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(err.error?.detail ?? 'Impossibile creare il diario');
      },
    });
  }
}
