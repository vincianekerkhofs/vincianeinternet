from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
from enum import Enum

# Enums
class DifficultyTier(str, Enum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"
    PRO = "Pro"

class SkillDomain(str, Enum):
    TIMING_RHYTHM = "Timing & Rhythm"
    STRUMMING = "Strumming & Rhythm Guitar"
    PICKING = "Picking"
    FRETTING = "Fretting Hand"
    CHORDS = "Chords & Harmony"
    SCALES = "Scales & Fretboard"
    LEAD = "Lead / Punteos"
    TECHNIQUES = "Techniques"
    MUSICAL_APPLICATION = "Musical Application"
    IMPROVISATION = "Improvisation"

# Exercise Model
class Exercise(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    domain: SkillDomain
    subdomain: Optional[str] = None
    difficulty_tier: DifficultyTier
    prerequisites: List[str] = []
    duration_seconds: int = 120
    bpm_start: int = 60
    bpm_target: int = 120
    tags: List[str] = []
    description_training: str  # What you train (1 sentence)
    description_why: str  # Why it matters musically
    steps: List[str] = []  # Step-by-step instructions
    mistakes_and_fixes: List[str] = []  # Common mistake + fix
    success_criteria: Dict[str, Any] = {}  # accuracy %, timing %, noise threshold
    level_up_variant: Optional[str] = None
    tab_data: Optional[Dict[str, Any]] = None  # Tablature data for practice screen
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ExerciseCreate(BaseModel):
    title: str
    domain: SkillDomain
    subdomain: Optional[str] = None
    difficulty_tier: DifficultyTier
    prerequisites: List[str] = []
    duration_seconds: int = 120
    bpm_start: int = 60
    bpm_target: int = 120
    tags: List[str] = []
    description_training: str
    description_why: str
    steps: List[str] = []
    mistakes_and_fixes: List[str] = []
    success_criteria: Dict[str, Any] = {}
    level_up_variant: Optional[str] = None
    tab_data: Optional[Dict[str, Any]] = None

# Curriculum Models
class RoutineBlock(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    block_type: str  # e.g., "warmup", "technique", "application", "cooldown"
    duration_seconds: int
    exercise_ids: List[str]
    target_bpm: Optional[int] = None
    notes: Optional[str] = None
    explanation: Optional[str] = None  # Post-block micro explanation

class Day(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    day_number: int  # 1-6
    routine_blocks: List[RoutineBlock]
    total_duration_seconds: int = 0
    is_rest_day: bool = False
    focus_summary: Optional[str] = None

class Week(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    number: int  # 1-52
    phase_id: str
    focus_domains: List[SkillDomain]
    days: List[Day]
    title: str
    description: str

class Phase(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    weeks_start: int
    weeks_end: int
    goals: List[str]
    description: str

# User Progress
class UserProgress(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str = "default_user"
    current_week: int = 1
    current_day: int = 1
    completed_exercises: List[str] = []
    completed_workouts: List[Dict[str, Any]] = []
    total_practice_minutes: int = 0
    streak_days: int = 0
    last_practice_date: Optional[datetime] = None
    exercise_stats: Dict[str, Dict[str, Any]] = {}  # exercise_id -> stats
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class WorkoutCompletion(BaseModel):
    week: int
    day: int
    completed_at: datetime = Field(default_factory=datetime.utcnow)
    duration_minutes: int
    exercises_completed: List[str]

# Settings
class UserSettings(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str = "default_user"
    preferred_duration: int = 30  # minutes: 15, 30, 45, 60
    metronome_enabled: bool = True
    count_in_enabled: bool = True
    audio_feedback: bool = True
    guitar_type: str = "electric"  # electric, acoustic
    onboarding_completed: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
