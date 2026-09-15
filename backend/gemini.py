import os
import json
from pathlib import Path
from dotenv import load_dotenv
from google import genai


# Find the .env file next to this gemini.py file
BASE_DIR = Path(__file__).resolve().parent
ENV_FILE = BASE_DIR / ".env"

load_dotenv(ENV_FILE)

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError(
        f"GEMINI_API_KEY is missing. Expected .env at: {ENV_FILE}"
    )

client = genai.Client(api_key=API_KEY)


def analyze_segments(segments):

    prompt = f"""
You are analyzing a student's learning behavior during a 40-second
educational video.

The data has been divided into 10-second segments.

For each segment, consider:
- heart rate
- observed interaction/event labels

Identify possible changes in:
- attention
- engagement
- learning behavior

Do not make medical diagnoses.
Treat heart rate only as a supporting signal, not proof of emotion
or mental state.

Return a concise analysis for each segment and an overall summary.

Data:
{json.dumps(segments, indent=2)}
"""

    response = client.models.generate_content(
    model="gemini-3.6-flash",
        contents=prompt
    )

    return {
        "analysis": response.text
    }