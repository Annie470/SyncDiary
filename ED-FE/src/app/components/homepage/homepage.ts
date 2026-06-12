import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DiaryService } from '../../shared/services/diary-service';
import { UserService } from '../../shared/services/user-service';
import type { IDiaryResponse } from '../../shared/models/diary';

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
  currentUser = this.userService.currentUser;
  todayFormatted = new Date().toLocaleDateString('it-IT', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  constructor() {
    this.ensureUser();
    this.loadDiaries();
  }

  private ensureUser(): void {
    if (!this.currentUser()) {
      this.userService.getMe().subscribe({
        next: (user) => this.userService.setUser(user),
        error: () => {},
      });
    }
  }

  private loadDiaries(): void {
    this.loading.set(true);
    this.diaryService.getAllDiaries().subscribe({
      next: (data: IDiaryResponse[]) => {
        this.diaries.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Impossibile caricare i diari');
      },
    });
  }

  getAuthor(diary: IDiaryResponse): string {
    const user = this.currentUser();
    return user && diary.user_id === user.id ? user.username : 'Anonimo';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('it-IT', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  }
}
