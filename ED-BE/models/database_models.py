from beanie import Document
from datetime import date

class User(Document):
    username: str
    password: str

class Diary(Document):
    user_id: str
    text: str
    daily_date: date