import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY")
    JWT_ALGORITHM: str= os.getenv("JWT_ALGORITHM")
    ACCESS_TOKEN_EXPIRE_DAYS: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_DAYS"))
    MONGODB_URL: str= os.getenv("MONGODB_URL")
    MONGONAME: str =os.getenv("MONGONAME")

settings = Settings()