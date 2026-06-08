import traceback
from fastapi import HTTPException
from models.database_models import Diary, User
from models.schemas.diary import DiaryRequest, DiaryResponse
from typing import List
from datetime import date

class DiaryService:
    @staticmethod
    async def create_diary(diary_data: DiaryRequest, username: str):
        try:
            user = await User.find_one(User.username == username)
            if not user:
                raise HTTPException(status_code=404, detail="Utente non trovato")

            existing = await Diary.find_one(
                Diary.user_id == str(user.id),
                Diary.daily_date == date.today()
            )
            if existing:
                raise HTTPException(status_code=409, detail="Hai già scritto un diario oggi")

            diary = Diary(
                text=diary_data.text,
                daily_date=date.today(),
                user_id=str(user.id)
            )
            await diary.insert()
            return diary
        except HTTPException:
            raise
        except Exception:
            traceback.print_exc()
            raise HTTPException(500, "Errore interno del server")

    @staticmethod
    async def get_user_diaries(username: str) -> List[DiaryResponse]:
        try:
            user = await User.find_one(User.username == username)
            if not user:
                raise HTTPException(status_code=404, detail="Utente non trovato")
            diaries = await Diary.find(Diary.user_id == str(user.id)).to_list()
            return [
                DiaryResponse(id=str(d.id), text=d.text, daily_date=d.daily_date, user_id=d.user_id)
                for d in diaries
            ]
        except HTTPException:
            raise
        except Exception:
            traceback.print_exc()
            raise HTTPException(500, "Errore interno del server")

    @staticmethod
    async def get_all_diaries(username: str) -> List[DiaryResponse]:
        try:
            diaries = await Diary.find().to_list()
            return [
                DiaryResponse(id=str(d.id), text=d.text, daily_date=d.daily_date, user_id=d.user_id)
                for d in diaries
            ]
        except HTTPException:
            raise
        except Exception:
            traceback.print_exc()
            raise HTTPException(500, "Errore interno del server")

    @staticmethod
    async def get_diary_by_id(diary_id: str):
        try:
            diary = await Diary.find_one(Diary.id == diary_id)
            if not diary:
                raise HTTPException(status_code=404, detail="Diary non trovato")
            return DiaryResponse(
                id=str(diary.id),
                text=diary.text,
                daily_date=diary.daily_date,
                user_id=diary.user_id
            )
        except HTTPException:
            raise
        except Exception:
            traceback.print_exc()
            raise HTTPException(500, "Errore interno del server")

    @staticmethod
    async def delete_diary(diary_id: str, username: str):
        try:
            user = await User.find_one(User.username == username)
            if not user:
                raise HTTPException(status_code=404, detail="Utente non trovato")

            diary = await Diary.find_one(Diary.id == diary_id)
            if not diary:
                raise HTTPException(status_code=404, detail="Diary non trovato")

            if diary.user_id != str(user.id):
                raise HTTPException(403, "Non autorizzato ad eliminare questo Diary")

            await diary.delete()
            return {"message": "Diary eliminato con successo"}
        except HTTPException:
            raise
        except Exception:
            traceback.print_exc()
            raise HTTPException(500, "Errore interno del server")
