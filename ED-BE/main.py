from fastapi import FastAPI
from contextlib import asynccontextmanager
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from config import settings
from models.database_models import User, Diary
from routers import auth, diary

@asynccontextmanager
async def lifespan(app:FastAPI):
    client =AsyncIOMotorClient(settings.MONGODB_URL)
    database = client[settings.MONGONAME]
    await init_beanie(
        database=database,  
        document_models=[User, Diary]
    )
    print(f"STARTED AT: {settings.MONGODB_URL}")
    yield
    client.close()

app=FastAPI(lifespan=lifespan)
app.include_router(auth.router)
app.include_router(diary.router)

@app.get("/")
async def root():
    return {"message": "Diary App API", "status": "running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app"
    )