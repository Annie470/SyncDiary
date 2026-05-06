from fastapi import APIRouter, Depends
from typing import List
from models.database_models import Diary
from models.schemas.diary import DiaryRequest, DiaryResponse
from dependencies.auth import get_current_user
from services.diary import DiaryService

router = APIRouter(prefix="/sync-diary/diaries")

@router.post("/")
async def create_diary(diary_data: DiaryRequest,username: str = Depends(get_current_user)):
    return await DiaryService.create_diary(diary_data, username)

@router.get("/my-diaries", response_model=List[Diary])
async def get_my_diaries(username: str = Depends(get_current_user)):
    return await DiaryService.get_user_diaries(username)

@router.get("/daily-diaries", response_model=List[Diary])
async def get_all_diaries(username: str = Depends(get_current_user)):
    return await DiaryService.get_all_diaries()

@router.get("/{diary_id}", response_model=DiaryResponse)
async def get_diary(diary_id: str,username: str = Depends(get_current_user)):
    return await DiaryService.get_diary_by_id(diary_id)

@router.delete("/{diary_id}")
async def delete_diary(
    diary_id: str,
    username: str = Depends(get_current_user)
):
    return await DiaryService.delete_diary(diary_id, username)