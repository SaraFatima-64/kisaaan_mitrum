#!/bin/bash
# run.sh

# Function to cleanup child processes on exit
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap SIGINT (Ctrl+C) and call cleanup
trap cleanup SIGINT SIGTERM

echo "Starting FastAPI backend..."
cd backend
if [ -f "venv/Scripts/activate" ]; then
    source venv/Scripts/activate
elif [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
fi
uvicorn main:app --reload &
BACKEND_PID=$!
cd ..

echo "Starting React frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "Both servers are running."
echo "Press Ctrl+C to stop."

# Wait for background processes
wait $BACKEND_PID $FRONTEND_PID
