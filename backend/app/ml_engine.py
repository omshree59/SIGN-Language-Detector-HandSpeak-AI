import torch
import torch.nn as nn
import numpy as np
import os

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

# 3. Create the prediction function
def predict_sign(landmarks_list):
    """
    Takes a list of 63 normalized coordinates, feeds them to PyTorch,
    and returns the predicted letter and confidence score.
    """
    try:
        # Convert the python list into a PyTorch tensor
        tensor_data = torch.FloatTensor([landmarks_list])
        
        # Turn off gradient calculation for faster inference
        with torch.no_grad():
            outputs = model(tensor_data)
            
            # Apply softmax to get percentages (0.0 to 1.0)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            
            # Get the highest probability and its corresponding index
            confidence, predicted_idx = torch.max(probabilities, 1)
            
            letter = ALPHABET[predicted_idx.item()]
            conf_score = round(confidence.item() * 100, 2)
            
            return letter, conf_score
    except Exception as e:
        return None, 0.0