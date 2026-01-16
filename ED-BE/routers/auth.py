from fastapi import APIRouter
from models.schemas.auth import Token, LoginRequest, RegisterRequest, UserResponse
from services.auth import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest):
    return await AuthService.login(login_data)

@router.post("/register", response_model=UserResponse)
async def register(register_data: RegisterRequest):
    user = await AuthService.register(register_data)
    return UserResponse(id=str(user.id), username= user.username)