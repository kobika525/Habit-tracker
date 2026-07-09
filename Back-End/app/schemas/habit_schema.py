from typing import Optional

from pydantic import BaseModel, Field


class HabitCreate(BaseModel):
    title: str = Field(..., min_length=1)
    description: Optional[str] = ""


class HabitUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None


class HabitOut(BaseModel):
    id: str = Field(alias="_id")
    user: str
    title: str
    description: Optional[str] = ""
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None

    class Config:
        populate_by_name = True
