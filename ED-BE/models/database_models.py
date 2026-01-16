from beanie import Document, Link
from datetime import date

class User(Document):
    username:str
    password:str

class Diary(Document):
    user:Link[User]
    text:str
    daily_date:date