from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import MONGO_URI, MONGO_DB_NAME

client = AsyncIOMotorClient(MONGO_URI)
db = client[MONGO_DB_NAME]

users_collection = db["users"]
habits_collection = db["habits"]
logs_collection = db["logs"]


async def init_indexes():
    await users_collection.create_index("email", unique=True)
    await logs_collection.create_index([("habit", 1), ("date", 1)], unique=True)
