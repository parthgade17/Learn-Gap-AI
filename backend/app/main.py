import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routes import validator, gap_analysis, remedial_plans, dashboard, csv_handler, assessment_buffer
from .redis_client import redis_buffer_manager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Start Redis -> Supabase background sync worker (runs every 10-15s)
    worker_task = asyncio.create_task(redis_buffer_manager.start_background_worker())
    yield
    # Shutdown: Stop worker gracefully
    redis_buffer_manager.stop_background_worker()
    worker_task.cancel()

app = FastAPI(
    title="LearnGap AI API",
    description="Python FastAPI Decision-Support Backend for Foundational Learning Remediation (IIT Bombay Techfest 2026-27)",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS middleware to allow requests from React PWA frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(validator.router, prefix=settings.API_V1_STR)
app.include_router(gap_analysis.router, prefix=settings.API_V1_STR)
app.include_router(remedial_plans.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)
app.include_router(csv_handler.router, prefix=settings.API_V1_STR)
app.include_router(assessment_buffer.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "project": "LearnGap AI",
        "description": "Teacher-in-the-loop decision-support tool turning foundational assessment into remedial action plans",
        "competition": "Techfest 2026-27, IIT Bombay (Team SuperNova)",
        "tech_stack": {
            "backend": "Python FastAPI",
            "database": "Supabase (PostgreSQL with RLS)",
            "frontend": "React Progressive Web App (PWA)"
        },
        "docs_url": "/docs",
        "health_check": "/health"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "supabase_connected": settings.is_supabase_configured,
        "supabase_url": settings.SUPABASE_URL
    }
