from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException
from pymongo.errors import DuplicateKeyError

from app.core.database import habits_collection, logs_collection
from app.core.deps import get_current_user_id
from app.schemas.log_schema import LogCreate
from app.utils.serializers import serialize_doc

router = APIRouter(prefix="/api/logs", tags=["Logs"])


def to_object_id(id_str: str) -> ObjectId:
    try:
        return ObjectId(id_str)
    except (InvalidId, TypeError):
        raise HTTPException(status_code=400, detail="Invalid id")


def today_str() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


@router.get("")
async def get_all_logs(user_id: str = Depends(get_current_user_id)):
    habit_cursor = habits_collection.find({"user": ObjectId(user_id)}, {"_id": 1})
    habit_ids = [doc["_id"] async for doc in habit_cursor]

    cursor = logs_collection.find({"habit": {"$in": habit_ids}}).sort("date", -1)
    logs = [serialize_doc(doc) async for doc in cursor]
    return logs


@router.post("", status_code=201)
async def create_log(payload: LogCreate, user_id: str = Depends(get_current_user_id)):
    habit_oid = to_object_id(payload.habitId)

    habit = await habits_collection.find_one({"_id": habit_oid, "user": ObjectId(user_id)})

    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    date = today_str()

    existing = await logs_collection.find_one({"habit": habit_oid, "date": date})
    if existing:
        raise HTTPException(status_code=400, detail="Habit already marked complete today")

    log_doc = {
        "user": ObjectId(user_id),
        "habit": habit_oid,
        "date": date,
        "createdAt": datetime.now(timezone.utc),
    }

    try:
        result = await logs_collection.insert_one(log_doc)
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Habit already marked complete today")

    log_doc["_id"] = result.inserted_id
    return serialize_doc(log_doc)


@router.get("/{habit_id}")
async def get_habit_logs(habit_id: str, user_id: str = Depends(get_current_user_id)):
    habit_oid = to_object_id(habit_id)

    habit = await habits_collection.find_one({"_id": habit_oid, "user": ObjectId(user_id)})
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    cursor = logs_collection.find({"habit": habit_oid}).sort("date", -1)
    logs = [serialize_doc(doc) async for doc in cursor]
    return logs
