from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.database import users_collection
from app.core.deps import get_current_user_id
from app.core.security import hash_password, verify_password, create_access_token
from app.schemas.auth_schema import RegisterRequest, LoginRequest

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest):
    existing = await users_collection.find_one({"email": payload.email.lower()})

    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(payload.password)

    user_doc = {
        "name": payload.name,
        "email": payload.email.lower(),
        "password": hashed,
        "createdAt": datetime.now(timezone.utc),
    }

    result = await users_collection.insert_one(user_doc)
    user_id = str(result.inserted_id)

    token = create_access_token(user_id)

    return {
        "token": token,
        "user": {
            "id": user_id,
            "name": payload.name,
            "email": payload.email.lower(),
        },
    }


@router.post("/login")
async def login(payload: LoginRequest):
    user = await users_collection.find_one({"email": payload.email.lower()})

    if not user or not verify_password(payload.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    user_id = str(user["_id"])
    token = create_access_token(user_id)

    return {
        "token": token,
        "user": {
            "id": user_id,
            "name": user["name"],
            "email": user["email"],
        },
    }


@router.get("/me")
async def get_me(user_id: str = Depends(get_current_user_id)):
    try:
        oid = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user id")

    user = await users_collection.find_one({"_id": oid})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "createdAt": user["createdAt"].isoformat() if user.get("createdAt") else None,
    }
