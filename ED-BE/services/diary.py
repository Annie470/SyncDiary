from fastapi import HTTPException
from models.database_models import Diary, User
from models.schemas.diary import DiaryRequest, DiaryResponse
from typing import List

class DiaryService:
    @staticmethod
    async def create_diary(diary_data: DiaryRequest, username: str):
        user = await User.find_one(User.username == username)
        if not user:
            raise HTTPException(status_code=404, detail="Utente non trovato")
        
        diary = Diary(
            text=diary_data.text,
            daily_date=diary_data.daily_date,
            user=user
        )       
        await diary.insert()
        return diary
    
    @staticmethod
    async def get_user_diaries(username: str) -> List[Diary]:
        user = await User.find_one(User.username == username)
        if not user:
            raise HTTPException(status_code=404, detail="Utente non trovato")      
        diaries = await Diary.find(Diary.user.id == user.id).to_list()

        return diaries
    
    @staticmethod
    async def get_diary_by_id(diary_id: str):      
        diary = await Diary.find_one(Diary.id == diary_id) 
        if not diary:
            raise HTTPException(status_code=404, detail="Diary non trovato")
            
        await diary.fetch_link(Diary.user)        
        return DiaryResponse(
            id=str(diary.id),
            text=diary.text,
            daily_date=diary.daily_date,
            user_id=str(diary.user.id)
        )
    
    @staticmethod
    async def delete_diary(diary_id: str, username: str):
        user = await User.find_one(User.username == username)
        if not user:
            raise HTTPException(status_code=404, detail="Utente non trovato")
        
        diary = await Diary.find_one(Diary.id == diary_id)
        
        if not diary:
            raise HTTPException(status_code=404, detail="Diary non trovato")
        
        await diary.fetch_link(Diary.user)
        
        if str(diary.user.id) != str(user.id):
            raise HTTPException(
                status_code=403,
                detail="Non autorizzato ad eliminare questo Diary"
            )
        
        await diary.delete()
        return {"message": "Diary eliminato con successo"}