import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

import joblib

# Load dataset
df = pd.read_csv("processed_data.csv")

# Features
X = df.drop("label", axis=1)

# Target
y = df["label"]

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Train AI model
model = RandomForestClassifier()

model.fit(X_train, y_train)

# Save trained model
joblib.dump(model, "rf_model.pkl")

print("AI Model Trained Successfully")