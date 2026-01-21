from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'guitar_gym')]

# Create the main app
app = FastAPI(title="Guitar Gym API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Import models and seed data
from models import (
    Exercise, ExerciseCreate, DifficultyTier, SkillDomain,
    Phase, Week, Day, RoutineBlock,
    UserProgress, WorkoutCompletion, UserSettings
)
from seed_exercises import get_all_exercises, ALL_EXERCISES
from seed_curriculum import get_phases, get_week, get_today_workout, PHASES, generate_full_curriculum

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Startup event - seed database
@app.on_event("startup")
async def startup_event():
    """Seed the database with exercises and curriculum on startup."""
    logger.info("Starting Guitar Gym API...")
    
    # Check if exercises exist
    exercises_count = await db.exercises.count_documents({})
    if exercises_count == 0:
        logger.info("Seeding exercises...")
        exercises_data = get_all_exercises()
        if exercises_data:
            await db.exercises.insert_many(exercises_data)
            logger.info(f"Seeded {len(exercises_data)} exercises")
    else:
        logger.info(f"Found {exercises_count} existing exercises")
    
    # Check if phases exist
    phases_count = await db.phases.count_documents({})
    if phases_count == 0:
        logger.info("Seeding phases...")
        phases_data = get_phases()
        if phases_data:
            await db.phases.insert_many(phases_data)
            logger.info(f"Seeded {len(phases_data)} phases")
    
    # Seed first 12 weeks with high detail
    weeks_count = await db.weeks.count_documents({})
    if weeks_count == 0:
        logger.info("Seeding curriculum weeks...")
        for week_num in range(1, 53):
            week_data = get_week(week_num)
            await db.weeks.insert_one(week_data)
        logger.info("Seeded 52 weeks of curriculum")
    
    logger.info("Guitar Gym API startup complete!")

# Root endpoint
@api_router.get("/")
async def root():
    return {"message": "Welcome to Guitar Gym API", "version": "1.0.0"}

# Health check
@api_router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "timestamp": datetime.utcnow().isoformat()
    }

# ============== EXERCISES ENDPOINTS ==============

@api_router.get("/exercises")
async def get_exercises(
    domain: Optional[str] = None,
    difficulty: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = Query(default=50, le=100),
    skip: int = 0
):
    """Get all exercises with optional filters."""
    query = {}
    
    if domain:
        query["domain"] = domain
    if difficulty:
        query["difficulty_tier"] = difficulty
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"tags": {"$regex": search, "$options": "i"}}
        ]
    
    exercises = await db.exercises.find(query).skip(skip).limit(limit).to_list(limit)
    total = await db.exercises.count_documents(query)
    
    # Convert ObjectId to string
    for ex in exercises:
        if '_id' in ex:
            ex['_id'] = str(ex['_id'])
    
    return {
        "exercises": exercises,
        "total": total,
        "limit": limit,
        "skip": skip
    }

@api_router.get("/exercises/domains")
async def get_domains():
    """Get all skill domains with exercise counts."""
    pipeline = [
        {"$group": {"_id": "$domain", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    result = await db.exercises.aggregate(pipeline).to_list(20)
    return {
        "domains": [{"name": r["_id"], "count": r["count"]} for r in result]
    }

@api_router.get("/exercises/difficulties")
async def get_difficulties():
    """Get all difficulty tiers with exercise counts."""
    pipeline = [
        {"$group": {"_id": "$difficulty_tier", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}}
    ]
    result = await db.exercises.aggregate(pipeline).to_list(10)
    return {
        "difficulties": [{"name": r["_id"], "count": r["count"]} for r in result]
    }

@api_router.get("/exercises/{exercise_id}")
async def get_exercise(exercise_id: str):
    """Get a specific exercise by ID."""
    exercise = await db.exercises.find_one({"id": exercise_id})
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
    if '_id' in exercise:
        exercise['_id'] = str(exercise['_id'])
    return exercise

# ============== CURRICULUM ENDPOINTS ==============

@api_router.get("/phases")
async def get_all_phases():
    """Get all curriculum phases."""
    phases = await db.phases.find().to_list(10)
    for p in phases:
        if '_id' in p:
            p['_id'] = str(p['_id'])
    return {"phases": phases}

@api_router.get("/weeks")
async def get_all_weeks(phase_id: Optional[str] = None):
    """Get all weeks, optionally filtered by phase."""
    query = {}
    if phase_id:
        query["phase_id"] = phase_id
    
    weeks = await db.weeks.find(query).sort("number", 1).to_list(52)
    for w in weeks:
        if '_id' in w:
            w['_id'] = str(w['_id'])
    return {"weeks": weeks}

@api_router.get("/weeks/{week_number}")
async def get_week_detail(week_number: int):
    """Get detailed week data."""
    if week_number < 1 or week_number > 52:
        raise HTTPException(status_code=400, detail="Week must be between 1 and 52")
    
    week = await db.weeks.find_one({"number": week_number})
    if not week:
        # Generate on the fly if not found
        week = get_week(week_number)
    else:
        if '_id' in week:
            week['_id'] = str(week['_id'])
    
    return week

@api_router.get("/today")
async def get_today(week: int = 1, day: int = 1):
    """Get today's workout based on current week and day."""
    if week < 1 or week > 52:
        week = 1
    if day < 1 or day > 6:
        day = 1
    
    # Get the day's workout
    week_data = await db.weeks.find_one({"number": week})
    if not week_data:
        week_data = get_week(week)
    
    day_data = week_data["days"][day - 1] if day <= len(week_data["days"]) else week_data["days"][0]
    
    # Get phase info
    phase = await db.phases.find_one({"id": week_data["phase_id"]})
    
    # Fetch exercise details for each block
    exercise_details = []
    for block in day_data.get("routine_blocks", []):
        block_exercises = []
        for ex_id in block.get("exercise_ids", []):
            ex = await db.exercises.find_one({"id": ex_id})
            if ex:
                if '_id' in ex:
                    ex['_id'] = str(ex['_id'])
                block_exercises.append(ex)
        block["exercises"] = block_exercises
    
    return {
        "week_number": week,
        "day_number": day,
        "phase": {
            "id": phase["id"] if phase else "phase-1",
            "name": phase["name"] if phase else "Foundations"
        },
        "week_title": week_data.get("title", f"Week {week}"),
        "day": day_data,
        "total_duration_minutes": day_data.get("total_duration_seconds", 1800) // 60
    }

# ============== PROGRESS ENDPOINTS ==============

@api_router.get("/progress")
async def get_user_progress(user_id: str = "default_user"):
    """Get user progress."""
    progress = await db.progress.find_one({"user_id": user_id})
    
    if not progress:
        # Create default progress
        progress = UserProgress(user_id=user_id).dict()
        await db.progress.insert_one(progress)
    
    if '_id' in progress:
        progress['_id'] = str(progress['_id'])
    
    return progress

@api_router.post("/progress/workout")
async def complete_workout(completion: WorkoutCompletion, user_id: str = "default_user"):
    """Record a completed workout."""
    # Get or create progress
    progress = await db.progress.find_one({"user_id": user_id})
    
    if not progress:
        progress = UserProgress(user_id=user_id).dict()
    
    # Update progress
    progress["completed_workouts"].append(completion.dict())
    progress["total_practice_minutes"] += completion.duration_minutes
    progress["completed_exercises"].extend(completion.exercises_completed)
    progress["completed_exercises"] = list(set(progress["completed_exercises"]))  # Dedupe
    
    # Update streak
    today = datetime.utcnow().date()
    last_practice = progress.get("last_practice_date")
    if last_practice:
        if isinstance(last_practice, str):
            last_practice = datetime.fromisoformat(last_practice).date()
        elif isinstance(last_practice, datetime):
            last_practice = last_practice.date()
        
        if (today - last_practice).days == 1:
            progress["streak_days"] += 1
        elif (today - last_practice).days > 1:
            progress["streak_days"] = 1
    else:
        progress["streak_days"] = 1
    
    progress["last_practice_date"] = datetime.utcnow()
    progress["updated_at"] = datetime.utcnow()
    
    # Check if should advance
    if completion.week == progress.get("current_week", 1) and completion.day == progress.get("current_day", 1):
        if completion.day >= 5:
            progress["current_week"] = min(completion.week + 1, 52)
            progress["current_day"] = 1
        else:
            progress["current_day"] = completion.day + 1
    
    await db.progress.update_one(
        {"user_id": user_id},
        {"$set": progress},
        upsert=True
    )
    
    if '_id' in progress:
        progress['_id'] = str(progress['_id'])
    
    return progress

@api_router.post("/progress/reset")
async def reset_progress(user_id: str = "default_user"):
    """Reset user progress."""
    new_progress = UserProgress(user_id=user_id).dict()
    await db.progress.update_one(
        {"user_id": user_id},
        {"$set": new_progress},
        upsert=True
    )
    return new_progress

# ============== SETTINGS ENDPOINTS ==============

@api_router.get("/settings")
async def get_settings(user_id: str = "default_user"):
    """Get user settings."""
    settings = await db.settings.find_one({"user_id": user_id})
    
    if not settings:
        settings = UserSettings(user_id=user_id).dict()
        await db.settings.insert_one(settings)
    
    if '_id' in settings:
        settings['_id'] = str(settings['_id'])
    
    return settings

@api_router.put("/settings")
async def update_settings(updates: Dict[str, Any], user_id: str = "default_user"):
    """Update user settings."""
    await db.settings.update_one(
        {"user_id": user_id},
        {"$set": updates},
        upsert=True
    )
    
    settings = await db.settings.find_one({"user_id": user_id})
    if '_id' in settings:
        settings['_id'] = str(settings['_id'])
    
    return settings

# ============== STATS ENDPOINTS ==============

@api_router.get("/stats")
async def get_stats():
    """Get overall stats."""
    exercises_count = await db.exercises.count_documents({})
    phases_count = await db.phases.count_documents({})
    weeks_count = await db.weeks.count_documents({})
    
    # Domain breakdown
    domain_pipeline = [
        {"$group": {"_id": "$domain", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    domains = await db.exercises.aggregate(domain_pipeline).to_list(20)
    
    # Difficulty breakdown
    diff_pipeline = [
        {"$group": {"_id": "$difficulty_tier", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}}
    ]
    difficulties = await db.exercises.aggregate(diff_pipeline).to_list(10)
    
    return {
        "total_exercises": exercises_count,
        "total_phases": phases_count,
        "total_weeks": weeks_count,
        "domains": {d["_id"]: d["count"] for d in domains},
        "difficulties": {d["_id"]: d["count"] for d in difficulties}
    }

# Include the router
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
