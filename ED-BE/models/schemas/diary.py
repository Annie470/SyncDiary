from pydantic import BaseModel
from datetime import date

class DiaryRequest(BaseModel):
    text: str
   
class DiaryResponse(BaseModel):
    id: str
    text: str
    daily_date: date
    user_id: str
    
    class Config:
        from_attributes = True  