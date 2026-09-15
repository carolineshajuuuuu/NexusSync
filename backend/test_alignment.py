from data_loader import load_heart_rate, load_click_log
from alignment import align_data
import json
import os


# Load the research data
heart_rate = load_heart_rate("../data/heart_rate.csv")
click_events = load_click_log("../data/click_log.json")


# Align the data
segments = align_data(
    heart_rate,
    click_events
)


# Create final output
result = {
    "session_id": "demo_001",
    "segments": segments
}


# Create output folder if it doesn't exist
os.makedirs("output", exist_ok=True)


# Save JSON
with open("output/aligned_data.json", "w") as file:
    json.dump(result, file, indent=2)


print("\nNEXUSSYNC ALIGNED DATA")
print("======================")

for segment in segments:
    print(segment)

print("\n✅ Saved to output/aligned_data.json")