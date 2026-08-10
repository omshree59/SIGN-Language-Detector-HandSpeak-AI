import torch
import torch.nn as nn
import numpy as np
import os
import json
import math

# 1. Recreate the exact architecture from your training script
class ASLModel(nn.Module):
    def __init__(self, num_classes=26):
        super(ASLModel, self).__init__()
        self.layer1 = nn.Linear(63, 128)
        self.bn1 = nn.BatchNorm1d(128)
        self.relu = nn.ReLU()
        self.drop1 = nn.Dropout(0.3)
        
        self.layer2 = nn.Linear(128, 64)
        self.bn2 = nn.BatchNorm1d(64)
        self.drop2 = nn.Dropout(0.2)
        
        self.out = nn.Linear(64, num_classes)
        
    def forward(self, x):
        x = self.layer1(x)
        x = self.bn1(x)
        x = self.relu(x)
        x = self.drop1(x)
        
        x = self.layer2(x)
        x = self.bn2(x)
        x = self.relu(x)
        x = self.drop2(x)
        
        x = self.out(x)
        return x

# 2. Initialize the model and load the trained weights
WEIGHTS_PATH = os.path.join("ml", "weights", "asl_model.pth")
ALPHABET = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

# Instantiate the model and put it in evaluation mode
model = ASLModel(num_classes=26)
try:
    # weights_only=True is a security best practice for PyTorch
    model.load_state_dict(torch.load(WEIGHTS_PATH, weights_only=True))
    model.eval()
    print(f"✅ Successfully loaded model weights from {WEIGHTS_PATH}")
except Exception as e:
    print(f"❌ Error loading model weights: {e}")

# 3. Custom Sign Dictionary Logic
CUSTOM_SIGNS_FILE = os.path.join("ml", "custom_signs.json")

def load_custom_signs():
    if os.path.exists(CUSTOM_SIGNS_FILE):
        try:
            with open(CUSTOM_SIGNS_FILE, "r") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

custom_signs = load_custom_signs()

def teach_custom_sign(word, landmarks):
    custom_signs[word] = landmarks
    with open(CUSTOM_SIGNS_FILE, "w") as f:
        json.dump(custom_signs, f)

def euclidean_distance(l1, l2):
    return math.sqrt(sum((a - b) ** 2 for a, b in zip(l1, l2)))

# 4. Create the prediction function
def predict_sign(landmarks_list):
    """
    Takes a list of 63 normalized coordinates, checks custom signs first,
    then feeds them to PyTorch, and returns the predicted letter and confidence score.
    """
    try:
        # A. Check Custom Signs (Nearest Neighbor)
        best_dist = float('inf')
        best_word = None
        for word, stored_lm in custom_signs.items():
            if len(stored_lm) == len(landmarks_list):
                dist = euclidean_distance(landmarks_list, stored_lm)
                if dist < best_dist:
                    best_dist = dist
                    best_word = word
        
        # Threshold for similarity (approx 0.45 for 63 normalized coords)
        if best_word and best_dist < 0.45:
            # Map distance (0.0 to 0.45) to confidence (100% to ~50%)
            conf = max(0, 100 - (best_dist * 100))
            return best_word, round(conf, 2)

        # B. Fallback to PyTorch Base Model
        tensor_data = torch.FloatTensor([landmarks_list])
        
        with torch.no_grad():
            outputs = model(tensor_data)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            confidence, predicted_idx = torch.max(probabilities, 1)
            
            letter = ALPHABET[predicted_idx.item()]
            conf_score = round(confidence.item() * 100, 2)
            
            return letter, conf_score
    except Exception as e:
        print(f"Prediction error: {e}")
        return None, 0.0