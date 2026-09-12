import sys
import json
import joblib
import pandas as pd
import os

# Load model
model_path = os.path.join(
    os.path.dirname(__file__),
    "rf_model.pkl"
)

model = joblib.load(model_path)

label_map = {
    0: "LOW",
    1: "MEDIUM",
    2: "HIGH"
}

for line in sys.stdin:
    try:
        input_data = json.loads(line)
        sample = pd.DataFrame([input_data])
        prediction_num = int(model.predict(sample)[0])
        prediction = label_map[prediction_num]
        confidence = max(model.predict_proba(sample)[0]) * 100

        result = {
            "prediction": prediction,
            "confidence": float(round(confidence, 2))
        }

        print(json.dumps(result), flush=True)
    except Exception as error:
        print(json.dumps({"error": str(error)}), flush=True)