import os
import pandas as pd
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# --- 1. Dataset Setup ---
DATA_FILE = 'backend/ml/landmarks_dataset.csv'
WEIGHTS_DIR = 'backend/ml/weights'
MODEL_PATH = os.path.join(WEIGHTS_DIR, 'asl_model.pth')

# Create the weights folder if it doesn't exist yet
if not os.path.exists(WEIGHTS_DIR):
    os.makedirs(WEIGHTS_DIR)

print("Loading dataset...")
df = pd.read_csv(DATA_FILE)

# Separate the 63 coordinates (X) from the Alphabet labels (y)
X = df.drop('label', axis=1).values 
y_text = df['label'].values 

# Convert letters (A-Z) to numbers (0-25) so PyTorch can process them
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(y_text)

# Split into a training pile (80%) and a testing pile (20%)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Convert arrays into PyTorch Tensors
X_train = torch.FloatTensor(X_train)
X_test = torch.FloatTensor(X_test)
y_train = torch.LongTensor(y_train)
y_test = torch.LongTensor(y_test)

# Create a custom data loader for batching
class ASLDataset(Dataset):
    def __init__(self, features, labels):
        self.features = features
        self.labels = labels
        
    def __len__(self):
        return len(self.labels)
        
    def __getitem__(self, idx):
        return self.features[idx], self.labels[idx]

train_dataset = ASLDataset(X_train, y_train)
test_dataset = ASLDataset(X_test, y_test)

train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=32, shuffle=False)

# --- 2. Model Architecture ---
# This is the exact Multi-Layer Perceptron (MLP) from your specification
class ASLModel(nn.Module):
    def __init__(self, num_classes=26):
        super(ASLModel, self).__init__()
        
        # Input Layer -> First Hidden Layer
        self.layer1 = nn.Linear(63, 128)
        self.bn1 = nn.BatchNorm1d(128)
        self.relu = nn.ReLU()
        self.drop1 = nn.Dropout(0.3)
        
        # First Hidden Layer -> Second Hidden Layer
        self.layer2 = nn.Linear(128, 64)
        self.bn2 = nn.BatchNorm1d(64)
        self.drop2 = nn.Dropout(0.2)
        
        # Second Hidden Layer -> Output Layer (26 letters)
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

model = ASLModel(num_classes=len(label_encoder.classes_))

# --- 3. Training Loop ---
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

epochs = 50
print(f"Starting training for {epochs} epochs...")

for epoch in range(epochs):
    model.train()
    total_loss = 0
    correct = 0
    
    for batch_features, batch_labels in train_loader:
        optimizer.zero_grad()
        
        # Forward pass: guess the letter
        outputs = model(batch_features)
        loss = criterion(outputs, batch_labels)
        
        # Backward pass: learn from mistakes
        loss.backward()
        optimizer.step()
        
        total_loss += loss.item()
        
        # Calculate accuracy for this batch
        _, predicted = torch.max(outputs.data, 1)
        correct += (predicted == batch_labels).sum().item()
        
    epoch_loss = total_loss / len(train_loader)
    epoch_acc = (correct / len(train_dataset)) * 100
    
    # Print an update every 10 epochs
    if (epoch + 1) % 10 == 0 or epoch == 0:
        print(f"Epoch [{epoch+1}/{epochs}] | Loss: {epoch_loss:.4f} | Accuracy: {epoch_acc:.2f}%")

# --- 4. Testing and Saving ---
model.eval()
test_correct = 0
with torch.no_grad():
    for features, labels in test_loader:
        outputs = model(features)
        _, predicted = torch.max(outputs.data, 1)
        test_correct += (predicted == labels).sum().item()

test_acc = (test_correct / len(test_dataset)) * 100
print(f"\n✅ Training Complete! Final Test Accuracy: {test_acc:.2f}%")

# Save the trained brain (weights)
torch.save(model.state_dict(), MODEL_PATH)
print(f"💾 Model saved to {MODEL_PATH}")