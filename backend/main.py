import os
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from database import engine
import models
import gemini

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Kisan Mitrum Platform API")

# Setup CORS to communicate with React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Kisan Mitrum API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

class ChatRequest(BaseModel):
    message: str

def get_offline_response(message: str) -> str:
    msg = message.lower()
    if "weather" in msg:
        return "The current weather indicates partly cloudy conditions. It is safe to perform standard activities."
    elif "plant" in msg or "season" in msg:
        return "Based on the recent soil pH of 6.5 and current weather, I recommend planting tomatoes or peppers."
    elif "disease" in msg or "pest" in msg:
        return "If you notice yellowing leaves, it could be a nutrient deficiency. Consider applying organic fertilizer."
    elif "soil" in msg:
        return "Recent data from Kisan Sakhi shows soil moisture is at 42%, which is in the optimal range."
    else:
        return "I'm running in offline mode (because your OpenAI API key has exceeded its quota, is not configured properly, or is disabled in your region). I can still help with basic questions on weather, planting, and soil health. Can you describe your concern in more detail?"

@app.post("/api/chat")
def chat_endpoint(request: ChatRequest):
    if GEMINI_API_KEY and GEMINI_API_KEY != "insert_your_actual_gemini_key_here":
        try:
            prompt = f"You are an expert personal farming assistant for Kerala farmers called Kisan Mitrum that gives concise, accurate agricultural advice. The user says: '{request.message}'. Provide a helpful short response without formatting."
            response = gemini.ask_gemini(prompt)
        except Exception as e:
            print(f"LLM Error: {e}")
            response = get_offline_response(request.message)
    else:
        response = get_offline_response(request.message)
        
    return {"response": response}
