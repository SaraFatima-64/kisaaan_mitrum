@echo off
echo Starting project...

start "FastAPI Backend" cmd /k "cd backend && call venv\Scripts\activate.bat && uvicorn main:app --reload"

start "React Frontend" cmd /k "cd frontend && npm run dev"
