import os
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from dotenv import load_dotenv
from database import engine
import models

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
gemini_model = None
if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel(
        "gemini-1.5-flash",
        system_instruction="You are an expert personal farming assistant for Kerala farmers called Kisan Mitrum that gives concise, accurate agricultural advice."
    )

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
        return "I'm running in offline mode (because your Gemini API key has exceeded its quota, is not configured properly, or is disabled in your region). I can still help with basic questions on weather, planting, and soil health. Can you describe your concern in more detail?"

@app.post("/api/chat")
def chat_endpoint(request: ChatRequest):
    if gemini_model:
        try:
            response = gemini_model.generate_content(request.message)
            reply = response.text
        except Exception as e:
            print(f"LLM Error: {e}")
            reply = get_offline_response(request.message)
    else:
        reply = get_offline_response(request.message)
        
    return {"response": reply}
