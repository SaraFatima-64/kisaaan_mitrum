#!/bin/bash
# setup.sh

echo "Setting up backend..."
cd backend
# Check for Windows/Linux venv activation
if [ -f "venv/Scripts/activate" ]; then
    source venv/Scripts/activate
elif [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
else
    echo "Virtual environment not found. Please create it first."
fi
pip install -r requirements.txt
cd ..

echo "Setting up frontend..."
cd frontend
npm install
cd ..

echo "Setup complete!"
