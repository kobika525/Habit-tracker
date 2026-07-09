from typing import Optional

from pydantic import BaseModel, Field


class LogCreate(BaseModel):
    habitId: str = Field(..., min_length=1)


class LogOut(BaseModel):
    id: str = Field(alias="_id")
    user: str
    habit: str
    date: str
    createdAt: Optional[str] = None

    class Config:
        populate_by_name = True
