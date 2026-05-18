from fastapi import APIRouter, Depends, HTTPException
from models.schemas.auth import Token, LoginRequest, RegisterRequest, UserResponse
from services.auth import AuthService
from dependencies.auth import get_current_user
from models.database_models import User

router = APIRouter(prefix="/sync-diary/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest):
    return await AuthService.login(login_data)

@router.post("/register", response_model=UserResponse)
async def register(register_data: RegisterRequest):
    user = await AuthService.register(register_data)
    return UserResponse(id=str(user.id), username=user.username)

@router.get("/me", response_model=UserResponse)
async def get_me(username: str = Depends(get_current_user)):
    user = await User.find_one(User.username == username)
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")
    return UserResponse(id=str(user.id), username=user.username)