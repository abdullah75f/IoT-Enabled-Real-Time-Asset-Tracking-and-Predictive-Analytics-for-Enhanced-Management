import joblib
import numpy as np
import pandas as pd
import google.generativeai as genai
import argparse
import json
import os
from dotenv import load_dotenv
import sys

# Load environment variables
load_dotenv()

# Get API key from environment
api_key = os.getenv('GOOGLE_AI_API_KEY')
if not api_key:
    print(json.dumps({
        "anomaly": "Error",
        "recommendation": "GOOGLE_AI_API_KEY not found in environment variables"
    }))
    sys.exit(1)

try:
    # Configure Gemini API
    genai.configure(api_key=api_key)
    gemini_model = genai.GenerativeModel('gemini-1.5-flash')
except Exception as e:
    print(json.dumps({
        "anomaly": "Error",
        "recommendation": f"Failed to configure Gemini API: {str(e)}"
    }))
    sys.exit(1)

# Get the directory where the script is located
script_dir = os.path.dirname(os.path.abspath(__file__))

# Load the model and label encoder
try:
    model = joblib.load(os.path.join(script_dir, 'engine_health_rf_model.pkl'))
    label_encoder = joblib.load(os.path.join(script_dir, 'engine_health_label_encoder.pkl'))
except FileNotFoundError as e:
    print(json.dumps({
        "anomaly": "Error",
        "recommendation": f"Model files not found: {str(e)}"
    }))
    sys.exit(1)
except Exception as e:
    print(json.dumps({
        "anomaly": "Error",
        "recommendation": f"Failed to load model files: {str(e)}"
    }))
    sys.exit(1)

def validate_inputs(temp, speed):
    errors = []
    if not isinstance(temp, (int, float)) or not isinstance(speed, (int, float)):
        errors.append("Invalid input. Please enter numeric values for temperature and speed.")
    if temp < 50:
        errors.append("Engine temperature must be at least 50°C for a running vehicle.")
    if temp > 120:
        errors.append("Engine temperature must not exceed 120°C.")
    if speed < 0:
        errors.append("Speed cannot be negative.")
    if speed > 160:
        errors.append("Speed must not exceed 160 kph.")

    if errors:
        return False, " ".join(errors)
    return True, ""

def get_recommendation(anomaly_type: str, temp: float, speed: float) -> str:
    if anomaly_type == 'speed_anomaly':
        prompt = (
            f"The vehicle has a speed of {speed} kph, classified as a 'speed_anomaly', "
            f"with an engine temperature of {temp}°C, which is within the safe range (50–120°C). "
            f"Provide a concise recommendation (1-2 sentences) for the driver to address the high speed safely."
        )
    elif temp < 50:
        prompt = (
            f"The vehicle has an engine temperature of {temp}°C, which is below the safe range (50–120°C), "
            f"and a speed of {speed} kph, classified as '{anomaly_type}'. "
            f"Provide a concise recommendation (1-2 sentences) for the driver to address the low engine temperature safely."
        )
    elif temp > 120:
        prompt = (
            f"The vehicle has an engine temperature of {temp}°C, which is above the safe range (50–120°C), "
            f"and a speed of {speed} kph, classified as '{anomaly_type}'. "
            f"Provide a concise recommendation (1-2 sentences) for the driver to address the high engine temperature safely."
        )
    else:
        prompt = (
            f"The vehicle has an engine temperature of {temp}°C and speed of {speed} kph, "
            f"classified as '{anomaly_type}'. "
            f"Provide a concise recommendation (1-2 sentences) for the driver to address this situation safely."
        )
    try:
        response = gemini_model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Failed to generate recommendation: {str(e)}"

def predict_anomaly(temp, speed):
    valid, message = validate_inputs(temp, speed)
    if not valid:
        return {"anomaly": message, "recommendation": get_recommendation("invalid", temp, speed)}
    
    try:
        input_data = np.array([[temp, speed]])
        input_df = pd.DataFrame(input_data, columns=['engine_temperature', 'speed'])
        pred = model.predict(input_df)
        result = label_encoder.inverse_transform(pred)[0]
        recommendation = get_recommendation(result, temp, speed)
        return {"anomaly": result, "recommendation": recommendation}
    except Exception as e:
        return {"anomaly": "Error", "recommendation": f"Failed to predict anomaly: {str(e)}"}

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Predict vehicle anomaly')
    parser.add_argument('--temp', type=float, required=True, help='Engine temperature')
    parser.add_argument('--speed', type=float, required=True, help='Vehicle speed')
    
    args = parser.parse_args()
    
    try:
        result = predict_anomaly(args.temp, args.speed)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({
            "anomaly": "Error",
            "recommendation": f"Failed to predict anomaly: {str(e)}"
        })) 