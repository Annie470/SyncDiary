from fastapi import FastAPI
from contextlib import asynccontextmanager
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from models.database_models import User, Diary
from routers import auth, diary

async def delete_all_diaries():
    deleted = await Diary.delete_all()
    print(f"[SCHEDULER] Diaries eliminati: {deleted.deleted_count}")

@asynccontextmanager
async def lifespan(app:FastAPI):
    client =AsyncIOMotorClient(settings.MONGODB_URL)
    database = client[settings.MONGONAME]
    await init_beanie(
        database=database,
        document_models=[User, Diary]
    )
    print(f"STARTED AT: {settings.MONGODB_URL}")

    scheduler = AsyncIOScheduler()
    scheduler.add_job(delete_all_diaries, CronTrigger(hour=23, minute=59))
    scheduler.start()

    yield

    scheduler.shutdown()
    client.close()

app=FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_BASE_URL,"http://localhost:4201"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
app.include_router(auth.router)
app.include_router(diary.router)

@app.get("/")
async def root():
    return {"message": "Diary App API", "status": "running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        reload=True
    )