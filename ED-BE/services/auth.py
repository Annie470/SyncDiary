import asyncio
from fastapi import HTTPException
from models.database_models import User
from models.schemas.auth import LoginRequest, RegisterRequest
from utils.security import hash_password, verify_password, create_token

class AuthService:
    @staticmethod
    async def login(login_data: LoginRequest):
        try:
            user = await User.find_one(User.username == login_data.username)
            if not user:
                raise HTTPException(status_code=401, detail="Utente non trovato")
            
            correct_pwd = verify_password(login_data.password, user.password)
            if not correct_pwd:
                raise HTTPException(status_code=401, detail="Password errata")
        
            token = create_token(data={"sub": user.username})
            return {"access_token": token, "token_type": "bearer"}
        except HTTPException:
            raise
        except Exception:
            raise HTTPException(500, "Errore interno del server")
    
    @staticmethod
    async def register(register_data: RegisterRequest):
        try:
            existing_user = await User.find_one(User.username == register_data.username)
            if existing_user:
                raise HTTPException(status_code=400, detail="Username già in uso")
            hashed_password =  hash_password(register_data.password)
            user = User(
                username=register_data.username,
                password=hashed_password
            )    
            await user.insert()
            return user
        except HTTPException:
            raise
        except Exception:
            raise HTTPException(500, "Errore interno del server")