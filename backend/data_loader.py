import pandas as pd
import json


def load_heart_rate(file_path):

    df = pd.read_csv(file_path)

    return df.to_dict(orient="records")


def load_click_log(file_path):

    with open(file_path, "r") as file:

        return json.load(file)