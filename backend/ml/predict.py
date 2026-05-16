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

# Get input from Node.js
input_data = json.loads(sys.argv[1])

# Convert to dataframe
sample = pd.DataFrame([input_data])

# Predict
prediction_num = int(
    model.predict(sample)[0]
)

# Label conversion
label_map = {
    0: "LOW",
    1: "MEDIUM",
    2: "HIGH"
}

prediction = label_map[prediction_num]

# Confidence
confidence = max(
    model.predict_proba(sample)[0]
) * 100

# Final result
result = {
    "prediction": prediction,
    "confidence": float(round(confidence, 2))
}

print(json.dumps(result))