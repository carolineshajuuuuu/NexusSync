from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from data_loader import load_heart_rate, load_click_log
from alignment import align_data
from gemini import analyze_segments


app = FastAPI(
    title="NexusSync API",
    description="AI-assisted multimodal learning research backend",
    version="1.0"
)


# Allow the frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "NexusSync backend is running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }


@app.get("/analyze")
def analyze():

    # Load heart-rate data
    heart_rate = load_heart_rate(
        "../data/heart_rate.csv"
    )

    # Load user interaction data
    click_events = load_click_log(
        "../data/click_log.json"
    )

    # Align the different data sources
    segments = align_data(
        heart_rate,
        click_events
    )

    # Send aligned data to Gemini
    analysis = analyze_segments(
        segments
    )

    return analysis