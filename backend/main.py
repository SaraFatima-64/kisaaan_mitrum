import os
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional, Dict, Any
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from dotenv import load_dotenv
from database import engine
import models

load_dotenv()
print("GROQ KEY LOADED:", os.getenv("GROQ_API_KEY"))  # DEBUG LINE
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

groq_client = None
if GROQ_API_KEY and GROQ_API_KEY != "your_groq_api_key_here":
    groq_client = Groq(api_key=GROQ_API_KEY)

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Kisan Mitrum Platform API")

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
    return {"status": "healthy", "llm": "groq" if groq_client else "offline"}

class ChatRequest(BaseModel):
    message: str
    stateName: Optional[str] = None
    weather: Optional[Dict[str, Any]] = None
    dashboard: Optional[Dict[str, Any]] = None
    language: Optional[str] = None

def get_offline_response(request: ChatRequest) -> str:
    msg = request.message.lower()
    stateName = request.stateName or 'Kerala'
    if "weather" in msg:
        if request.weather:
            return f"The current weather in {stateName} indicates {request.weather.get('temp')}°C, {request.weather.get('humidity')}% humidity, and a {request.weather.get('precip')}% chance of precipitation."
        return "The current weather indicates partly cloudy conditions. It is safe to perform standard activities."
    elif "plant" in msg or "season" in msg:
        if request.dashboard:
            return f"Based on the recent soil pH of {request.dashboard.get('ph')} and {request.dashboard.get('moisture')} moisture in {stateName}, I recommend planting tomatoes or peppers."
        return "Based on the recent soil pH of 6.5 and current weather, I recommend planting tomatoes or peppers."
    elif "disease" in msg or "pest" in msg:
        if request.dashboard and request.dashboard.get("pests") == "none":
            return f"Currently there are no pests detected in {stateName} according to your dashboard. If you notice yellowing leaves, consider organic fertilizer."
        return "If you notice yellowing leaves, it could be a nutrient deficiency. Consider applying organic fertilizer."
    elif "soil" in msg:
        if request.dashboard:
            return f"Recent data shows soil moisture is at {request.dashboard.get('moisture')}, which is in the optimal range."
        return "Recent data shows soil moisture is at 42%, which is in the optimal range."
    else:
        return "I'm currently offline. I can still help with basic questions on weather, planting, and soil health."

@app.post("/api/chat")
def chat_endpoint(request: ChatRequest):
    if groq_client:
        try:
            system_content = f"You are an expert personal farming assistant for {request.stateName or 'Kerala'} farmers called Kisan Mitrum. Give concise, accurate agricultural advice."
            if request.weather:
                system_content += f" Current weather in {request.stateName}: Temp {request.weather.get('temp')}C, Humidity {request.weather.get('humidity')}%, Precip {request.weather.get('precip')}%, Wind {request.weather.get('wind')}km/h."
            if request.dashboard:
                system_content += f" Farm Dashboard Data: Soil Moisture {request.dashboard.get('moisture')}, Soil pH {request.dashboard.get('ph')}, Pests: {request.dashboard.get('pests')}."
            
            if request.language == 'hi':
                system_content += " You must respond entirely in Hindi (हिंदी)."
            elif request.language == 'ml':
                system_content += " You must respond entirely in Malayalam (മലയാളം)."

            response = groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {
                        "role": "system",
                        "content": system_content
                    },
                    {
                        "role": "user",
                        "content": request.message
                    }
                ],
                max_tokens=1024
            )
            reply = response.choices[0].message.content
        except Exception as e:
            print(f"LLM Error: {e}")
            reply = get_offline_response(request)
    else:
        reply = get_offline_response(request)

    return {"response": reply}