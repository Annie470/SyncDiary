import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IDiaryRequest, IDiaryResponse } from '../models/diary';

@Injectable({
  providedIn: 'root',
})
export class DiaryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.syD}/sync-diary/diaries`;

  createDiary(payload: IDiaryRequest) {
    return this.http.post<IDiaryResponse>(`${this.apiUrl}/`, payload);
  }

  getMyDiaries() {
    return this.http.get<IDiaryResponse[]>(`${this.apiUrl}/my-diaries`);
  }

  getAllDiaries() {
    return this.http.get<IDiaryResponse[]>(`${this.apiUrl}/daily-diaries`);
  }

  getDiaryById(id: string) {
    return this.http.get<IDiaryResponse>(`${this.apiUrl}/${id}`);
  }

  deleteDiary(id: string) {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
