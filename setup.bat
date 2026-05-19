@echo off
if not exist "backend\venv\" (
    echo Creating virtual environment...
    python -m venv backend\venv
)

echo Activating virtual environment and installing backend requirements...
call backend\venv\Scripts\activate.bat
pip install -r backend\requirements.txt

echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo Setup complete!
