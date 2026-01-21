from models import Phase, Week, Day, RoutineBlock, SkillDomain
from seed_exercises import ALL_EXERCISES, get_exercises_by_domain, get_exercises_by_difficulty
from models import DifficultyTier
import uuid

# Define the 4 Phases
PHASES = [
    Phase(
        id="phase-1",
        name="Foundations",
        weeks_start=1,
        weeks_end=8,
        goals=[
            "Build fundamental coordination",
            "Learn essential open chords",
            "Develop basic timing skills",
            "Master beginner strumming patterns"
        ],
        description="Build the foundation of your guitar skills. Focus on posture, basic chords, simple rhythms, and developing your musical ear."
    ),
    Phase(
        id="phase-2",
        name="Core Skills",
        weeks_start=9,
        weeks_end=20,
        goals=[
            "Learn pentatonic scales",
            "Develop alternate picking",
            "Master barre chords",
            "Build lead guitar basics"
        ],
        description="Expand your vocabulary with scales, techniques, and barre chords. Start developing your lead guitar voice."
    ),
    Phase(
        id="phase-3",
        name="Advanced Control",
        weeks_start=21,
        weeks_end=36,
        goals=[
            "Master multiple scale positions",
            "Develop speed and accuracy",
            "Learn advanced techniques",
            "Build improvisation skills"
        ],
        description="Refine your technique and expand your musical knowledge. Focus on speed, accuracy, and creative expression."
    ),
    Phase(
        id="phase-4",
        name="Proficiency",
        weeks_start=37,
        weeks_end=52,
        goals=[
            "Master the full fretboard",
            "Develop personal style",
            "Achieve professional-level technique",
            "Create original musical ideas"
        ],
        description="Polish your skills to professional level. Focus on musicality, personal expression, and advanced concepts."
    )
]

def get_phase_for_week(week_num: int) -> Phase:
    """Get the phase for a given week number."""
    for phase in PHASES:
        if phase.weeks_start <= week_num <= phase.weeks_end:
            return phase
    return PHASES[-1]

def get_exercises_for_week(week_num: int, domains: list):
    """Get appropriate exercises based on week number and domains."""
    # Determine difficulty based on week
    if week_num <= 8:
        primary_difficulty = DifficultyTier.BEGINNER
        secondary_difficulty = DifficultyTier.BEGINNER
    elif week_num <= 20:
        primary_difficulty = DifficultyTier.BEGINNER
        secondary_difficulty = DifficultyTier.INTERMEDIATE
    elif week_num <= 36:
        primary_difficulty = DifficultyTier.INTERMEDIATE
        secondary_difficulty = DifficultyTier.ADVANCED
    else:
        primary_difficulty = DifficultyTier.ADVANCED
        secondary_difficulty = DifficultyTier.PRO
    
    # Get exercises matching domains and difficulty
    matching = []
    for ex in ALL_EXERCISES:
        if ex.domain in domains:
            if ex.difficulty_tier == primary_difficulty or ex.difficulty_tier == secondary_difficulty:
                matching.append(ex)
    
    return matching[:10]  # Return up to 10 exercises

def create_routine_block(block_type: str, duration: int, exercises: list, notes: str = None, explanation: str = None):
    """Create a routine block."""
    return RoutineBlock(
        id=str(uuid.uuid4()),
        block_type=block_type,
        duration_seconds=duration,
        exercise_ids=[ex.id for ex in exercises[:3]] if exercises else [],
        notes=notes,
        explanation=explanation
    )

def create_day(day_num: int, week_num: int, focus_domains: list):
    """Create a day with routine blocks."""
    exercises = get_exercises_for_week(week_num, focus_domains)
    
    # Day 6 is review/jam day
    if day_num == 6:
        return Day(
            id=str(uuid.uuid4()),
            day_number=day_num,
            routine_blocks=[
                create_routine_block(
                    "review",
                    1800,  # 30 min review
                    exercises[:5],
                    "Review week's material",
                    "This week you learned new skills. This session reinforces them through free practice."
                )
            ],
            total_duration_seconds=1800,
            is_rest_day=False,
            focus_summary="Weekly Review & Jam Session"
        )
    
    # Regular training day
    warmup_exercises = [ex for ex in exercises if 'warm-up' in ex.tags or 'fundamentals' in ex.tags][:2]
    technique_exercises = [ex for ex in exercises if ex.domain in [SkillDomain.PICKING, SkillDomain.FRETTING, SkillDomain.TECHNIQUES]][:3]
    main_exercises = [ex for ex in exercises if ex.domain in focus_domains][:3]
    application_exercises = [ex for ex in exercises if ex.domain in [SkillDomain.MUSICAL_APPLICATION, SkillDomain.IMPROVISATION]][:2]
    
    blocks = [
        create_routine_block(
            "warmup",
            300,  # 5 min
            warmup_exercises or exercises[:2],
            "Warm up your hands and focus your mind",
            "Warming up prevents injury and prepares your muscles for precise movements."
        ),
        create_routine_block(
            "technique",
            600,  # 10 min
            technique_exercises or exercises[2:5],
            "Build fundamental technique",
            "Technique practice builds the physical skills that make everything else possible."
        ),
        create_routine_block(
            "main",
            900,  # 15 min
            main_exercises or exercises[:3],
            f"Focus: {', '.join([d.value for d in focus_domains[:2]])}",
            f"Today's focus is on {focus_domains[0].value if focus_domains else 'general skills'}."
        ),
        create_routine_block(
            "application",
            300,  # 5 min
            application_exercises or exercises[-2:],
            "Apply what you learned musically",
            "Application connects isolated skills to real music-making."
        )
    ]
    
    total_duration = sum(b.duration_seconds for b in blocks)
    
    return Day(
        id=str(uuid.uuid4()),
        day_number=day_num,
        routine_blocks=blocks,
        total_duration_seconds=total_duration,
        is_rest_day=False,
        focus_summary=f"Focus: {', '.join([d.value for d in focus_domains[:2]])}"
    )

def create_week(week_num: int):
    """Create a complete week."""
    phase = get_phase_for_week(week_num)
    
    # Define focus domains based on week number in a rotating pattern
    all_domains = list(SkillDomain)
    
    # Phase-appropriate domain selection
    if week_num <= 8:  # Phase 1: Foundations
        focus_domains = [
            [SkillDomain.TIMING_RHYTHM, SkillDomain.STRUMMING],
            [SkillDomain.CHORDS, SkillDomain.FRETTING],
            [SkillDomain.STRUMMING, SkillDomain.TIMING_RHYTHM],
            [SkillDomain.TECHNIQUES, SkillDomain.CHORDS],
            [SkillDomain.MUSICAL_APPLICATION, SkillDomain.STRUMMING],
            [SkillDomain.PICKING, SkillDomain.TIMING_RHYTHM],
            [SkillDomain.FRETTING, SkillDomain.CHORDS],
            [SkillDomain.TIMING_RHYTHM, SkillDomain.TECHNIQUES]
        ][(week_num - 1) % 8]
    elif week_num <= 20:  # Phase 2: Core Skills
        focus_domains = [
            [SkillDomain.SCALES, SkillDomain.PICKING],
            [SkillDomain.CHORDS, SkillDomain.STRUMMING],
            [SkillDomain.LEAD, SkillDomain.SCALES],
            [SkillDomain.TECHNIQUES, SkillDomain.FRETTING],
            [SkillDomain.IMPROVISATION, SkillDomain.SCALES],
            [SkillDomain.PICKING, SkillDomain.LEAD],
            [SkillDomain.MUSICAL_APPLICATION, SkillDomain.CHORDS],
            [SkillDomain.SCALES, SkillDomain.TECHNIQUES],
            [SkillDomain.LEAD, SkillDomain.IMPROVISATION],
            [SkillDomain.TIMING_RHYTHM, SkillDomain.STRUMMING],
            [SkillDomain.CHORDS, SkillDomain.SCALES],
            [SkillDomain.TECHNIQUES, SkillDomain.LEAD]
        ][(week_num - 9) % 12]
    elif week_num <= 36:  # Phase 3: Advanced Control
        focus_domains = [
            [SkillDomain.SCALES, SkillDomain.LEAD],
            [SkillDomain.TECHNIQUES, SkillDomain.PICKING],
            [SkillDomain.IMPROVISATION, SkillDomain.SCALES],
            [SkillDomain.LEAD, SkillDomain.TECHNIQUES],
            [SkillDomain.CHORDS, SkillDomain.MUSICAL_APPLICATION],
            [SkillDomain.PICKING, SkillDomain.TIMING_RHYTHM]
        ][(week_num - 21) % 6]
    else:  # Phase 4: Proficiency
        focus_domains = [
            [SkillDomain.IMPROVISATION, SkillDomain.LEAD],
            [SkillDomain.SCALES, SkillDomain.TECHNIQUES],
            [SkillDomain.MUSICAL_APPLICATION, SkillDomain.IMPROVISATION],
            [SkillDomain.LEAD, SkillDomain.CHORDS]
        ][(week_num - 37) % 4]
    
    # Create days 1-6
    days = [create_day(d, week_num, focus_domains) for d in range(1, 7)]
    
    # Generate week title and description based on focus
    domain_names = ', '.join([d.value for d in focus_domains])
    
    return Week(
        id=f"week-{week_num}",
        number=week_num,
        phase_id=phase.id,
        focus_domains=focus_domains,
        days=days,
        title=f"Week {week_num}: {domain_names}",
        description=f"This week focuses on {domain_names}. You'll build skills through structured practice and application."
    )

def generate_full_curriculum():
    """Generate the complete 52-week curriculum."""
    weeks = [create_week(w) for w in range(1, 53)]
    return {
        "phases": [p.dict() for p in PHASES],
        "weeks": [w.dict() for w in weeks]
    }

def get_phases():
    return [p.dict() for p in PHASES]

def get_week(week_num: int):
    return create_week(week_num).dict()

def get_today_workout(week: int, day: int):
    """Get today's workout."""
    week_data = create_week(week)
    if 1 <= day <= 6:
        return week_data.days[day - 1].dict()
    return week_data.days[0].dict()

if __name__ == "__main__":
    curriculum = generate_full_curriculum()
    print(f"Generated {len(curriculum['phases'])} phases")
    print(f"Generated {len(curriculum['weeks'])} weeks")
    for phase in curriculum['phases']:
        print(f"  {phase['name']}: Weeks {phase['weeks_start']}-{phase['weeks_end']}")
