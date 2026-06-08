import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DiaryService } from '../../shared/services/diary-service';
import { IDiaryResponse } from '../../shared/models/diary';
import { UserService } from '../../shared/services/user-service';
import { IUserResponse } from '../../shared/models/user';

@Component({
  selector: 'app-homepage',
  imports: [RouterLink],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {
  private diaryService = inject(DiaryService);
  private userService = inject(UserService);
  loading = signal(false);
  error = signal<string | null>(null);
  diaries = signal<IDiaryResponse[]>([]);
  selectedDiary = signal<IDiaryResponse | null>(null);
  username = signal<string>('');

  constructor() {
    this.loadDiaries();
    this.userService.getMe().subscribe({
      next: (user: IUserResponse) => this.username.set(user.username),
    });
  }

  loadDiaries(): void {
    this.loading.set(true);
    this.diaryService.getAllDiaries().subscribe({
      next: (data: IDiaryResponse[]) => {
        this.diaries.set(data);
        if (data.length > 0) this.selectedDiary.set(data[0]);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Impossibile caricare i diari');
      },
    });
  }

  selectDiary(diary: IDiaryResponse): void {
    this.selectedDiary.set(diary);
  }

  preview(text: string): string {
    return text.length > 60 ? text.slice(0, 60) + '…' : text;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('it-IT', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  }
}
