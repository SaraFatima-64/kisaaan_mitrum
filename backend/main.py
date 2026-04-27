import os
from fastapi import FastAPI
from pydantic import BaseModel
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

def get_offline_response(message: str) -> str:
    msg = message.lower()
    if "weather" in msg:
        return "The current weather indicates partly cloudy conditions. It is safe to perform standard activities."
    elif "plant" in msg or "season" in msg:
        return "Based on the recent soil pH of 6.5 and current weather, I recommend planting tomatoes or peppers."
    elif "disease" in msg or "pest" in msg:
        return "If you notice yellowing leaves, it could be a nutrient deficiency. Consider applying organic fertilizer."
    elif "soil" in msg:
        return "Recent data shows soil moisture is at 42%, which is in the optimal range."
    else:
        return "I'm currently offline. I can still help with basic questions on weather, planting, and soil health."

@app.post("/api/chat")
def chat_endpoint(request: ChatRequest):
    if groq_client:
        try:
            response = groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert personal farming assistant for Kerala farmers called Kisan Mitrum. Give concise, accurate agricultural advice."
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
            reply = get_offline_response(request.message)
    else:
        reply = get_offline_response(request.message)

    return {"response": reply}