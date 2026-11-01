import sys
import os
import uvicorn

# Ensure the backend directory is in sys.path regardless of working directory
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app.config import settings

if __name__ == "__main__":
    print(f"Starting LearnGap AI Python FastAPI backend on http://{settings.HOST}:{settings.PORT}")
    print(f"Swagger API Documentation available at http://127.0.0.1:{settings.PORT}/docs")
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True, app_dir=BACKEND_DIR)

