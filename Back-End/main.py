from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import CLIENT_URL
from app.core.database import init_indexes
from app.routes import auth_routes, habit_routes, log_routes


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_indexes()
    yield
    # Shutdown (nothing to clean up yet)


app = FastAPI(title="Habit Tracker API", version="1.0.0", lifespan=lifespan)

# CLIENT_URL may be "*" or a comma-separated list of allowed origins,
# e.g. "http://localhost:5173,https://my-frontend.example.com"
if CLIENT_URL.strip() == "*":
    allowed_origins = ["*"]
else:
    allowed_origins = [origin.strip() for origin in CLIENT_URL.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(habit_routes.router)
app.include_router(log_routes.router)


@app.get("/")
async def root():
    return {"message": "Habit Tracker API is running"}


@app.get("/health")
async def health_check():
    return {"status": "ok"}
