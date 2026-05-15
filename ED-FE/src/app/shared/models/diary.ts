export interface IDiaryRequest {
  text: string;
}

export interface IDiaryResponse {
  id: string;
  text: string;
  daily_date: string;
  user_id: string;
}
