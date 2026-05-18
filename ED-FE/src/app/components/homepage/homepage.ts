import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DiaryService } from '../../shared/services/diary-service';
import { IDiaryRequest, IDiaryResponse } from '../../shared/models/diary';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-homepage',
  imports: [FormsModule, DatePipe],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {
  private diaryService = inject(DiaryService);
  loading = signal(false);
  error = signal<string | null>(null);
  diaries = signal<IDiaryResponse[]>([]);
  showForm = signal(false);

  form: IDiaryRequest = { text: '' };

  constructor() {
    this.loadDiaries();
  }

  loadDiaries(): void {
    this.loading.set(true);
    this.diaryService.getAllDiaries().subscribe({
      next: (data: IDiaryResponse[]) => {
        this.diaries.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Impossibile caricare i diary');
      },
    });
  }

  openForm(): void {
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.form = { text: '' };
    this.error.set(null);
  }

  onSubmit(): void {
    this.loading.set(true);
    this.diaryService.createDiary(this.form).subscribe({
      next: () => {
        this.loading.set(false);
        this.loadDiaries();
        this.closeForm();
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(err.error?.detail ?? 'Impossibile creare il diary');
      },
    });
  }
}
