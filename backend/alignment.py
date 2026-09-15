def time_to_seconds(timestamp):
    minutes, seconds = map(int, timestamp.split(":"))
    return minutes * 60 + seconds


def align_data(heart_rate, click_events, window_size=10):

    segments = []

    # Your demo video/data is 40 seconds
    total_duration = 40

    for start in range(0, total_duration, window_size):

        end = start + window_size

        # -------------------------
        # HEART RATE
        # -------------------------

        hr_values = []

        for item in heart_rate:

            time = time_to_seconds(item["timestamp"])

            if start <= time < end:
                hr_values.append(float(item["heart_rate"]))

        if hr_values:
            average_hr = sum(hr_values) / len(hr_values)
        else:
            average_hr = None

        # -------------------------
        # CLICK EVENTS
        # -------------------------

        events = []

        for event in click_events:

            time = time_to_seconds(event["timestamp"])

            if start <= time < end:
                events.append(event["event"])

        # -------------------------
        # CREATE SEGMENT
        # -------------------------

        segments.append({
            "start": f"00:{start:02d}",
            "end": f"00:{end:02d}",
            "heart_rate": average_hr,
            "events": events
        })

    return segments