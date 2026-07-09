from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException

from app.core.database import habits_collection, logs_collection
from app.core.deps import get_current_user_id
from app.schemas.habit_schema import HabitCreate, HabitUpdate
from app.utils.serializers import serialize_doc

router = APIRouter(prefix="/api/habits", tags=["Habits"])


def to_object_id(id_str: str) -> ObjectId:
    try:
        return ObjectId(id_str)
    except (InvalidId, TypeError):
        raise HTTPException(status_code=400, detail="Invalid habit id")


@router.get("")
async def get_habits(user_id: str = Depends(get_current_user_id)):
    cursor = habits_collection.find({"user": ObjectId(user_id)}).sort("createdAt", -1)
    habits = [serialize_doc(doc) async for doc in cursor]
    return habits


@router.post("", status_code=201)
async def create_habit(payload: HabitCreate, user_id: str = Depends(get_current_user_id)):
    if not payload.title.strip():
        raise HTTPException(status_code=400, detail="Title is required")

    now = datetime.now(timezone.utc)

    habit_doc = {
        "user": ObjectId(user_id),
        "title": payload.title,
        "description": payload.description or "",
        "createdAt": now,
        "updatedAt": now,
    }

    result = await habits_collection.insert_one(habit_doc)
    habit_doc["_id"] = result.inserted_id

    return serialize_doc(habit_doc)


@router.put("/{habit_id}")
async def update_habit(
    habit_id: str,
    payload: HabitUpdate,
    user_id: str = Depends(get_current_user_id),
):
    oid = to_object_id(habit_id)

    habit = await habits_collection.find_one({"_id": oid, "user": ObjectId(user_id)})

    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    update_fields = {}
    if payload.title is not None:
        update_fields["title"] = payload.title
    if payload.description is not None:
        update_fields["description"] = payload.description

    update_fields["updatedAt"] = datetime.now(timezone.utc)

    await habits_collection.update_one({"_id": oid}, {"$set": update_fields})

    updated = await habits_collection.find_one({"_id": oid})
    return serialize_doc(updated)


@router.delete("/{habit_id}")
async def delete_habit(habit_id: str, user_id: str = Depends(get_current_user_id)):
    oid = to_object_id(habit_id)

    result = await habits_collection.find_one_and_delete(
        {"_id": oid, "user": ObjectId(user_id)}
    )

    if not result:
        raise HTTPException(status_code=404, detail="Habit not found")

    await logs_collection.delete_many({"habit": oid})

    return {"message": "Habit deleted"}
