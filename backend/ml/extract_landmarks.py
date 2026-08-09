import os
import urllib.request
import pandas as pd
import numpy as np
import mediapipe as mp

# --- 1. Setup MediaPipe 1.0.0 Tasks API ---
# The new API requires a model file. This downloads it automatically if missing.
TASK_FILE = 'backend/ml/hand_landmarker.task'
if not os.path.exists(TASK_FILE):
    print("Downloading MediaPipe model (hand_landmarker.task)...")
    url = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
    urllib.request.urlretrieve(url, TASK_FILE)
    print("Download complete!")

# Initialize the HandLandmarker using the new Tasks API
BaseOptions = mp.tasks.BaseOptions
HandLandmarker = mp.tasks.vision.HandLandmarker
HandLandmarkerOptions = mp.tasks.vision.HandLandmarkerOptions
VisionRunningMode = mp.tasks.vision.RunningMode

options = HandLandmarkerOptions(
    base_options=BaseOptions(model_asset_path=TASK_FILE),
    running_mode=VisionRunningMode.IMAGE,
    num_hands=1,
    min_hand_detection_confidence=0.5
)
detector = HandLandmarker.create_from_options(options)

# --- 2. Define our folders ---
DATA_DIR = 'backend/ml/data/asl_alphabet_train/asl_alphabet_train' 
OUTPUT_FILE = 'backend/ml/landmarks_dataset.csv'

ALPHABET = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ") 
IMAGES_PER_CLASS = 100 

all_data = []

print("Starting landmark extraction...")

for letter in ALPHABET:
    folder_path = os.path.join(DATA_DIR, letter)
    
    if not os.path.exists(folder_path):
        print(f"⚠️ Warning: Could not find folder {folder_path}. Check your folder structure!")
        continue
        
    print(f"Processing letter: {letter}...")
    
    images = os.listdir(folder_path)[:IMAGES_PER_CLASS]
    
    for img_name in images:
        img_path = os.path.join(folder_path, img_name)
        
        # MediaPipe 1.0.0 has a built-in image reader, replacing OpenCV
        try:
            mp_image = mp.Image.create_from_file(img_path)
        except Exception:
            continue
            
        # Detect hands in the image
        detection_result = detector.detect(mp_image)
        
        # If a hand is successfully detected
        if detection_result.hand_landmarks:
            # Get the first (and only) hand detected
            hand_landmarks = detection_result.hand_landmarks[0]
            
            # Extract raw coordinates (x, y, z) for all 21 points
            raw_points = np.array([[lm.x, lm.y, lm.z] for lm in hand_landmarks])
            
            # Normalize Step 1: Subtract the Wrist (Landmark 0)
            wrist = raw_points[0]
            shifted_points = raw_points - wrist
            
            # Normalize Step 2: Scale by the Maximum Distance from the Wrist
            # Calculate the Euclidean distance from the origin (wrist) for each point
            distances = np.linalg.norm(shifted_points, axis=1)
            max_distance = np.max(distances)
            
            if max_distance > 0:
                scaled_points = shifted_points / max_distance
            else:
                scaled_points = shifted_points
            
            # Flatten the 21x3 grid into a single row of 63 numbers
            flattened_features = scaled_points.flatten().tolist()
            
            row = [letter] + flattened_features
            all_data.append(row)

# --- 3. Save to a CSV file ---
if len(all_data) > 0:
    cols = ['label']
    for i in range(21):
        cols.extend([f'x{i}', f'y{i}', f'z{i}'])
        
    df = pd.DataFrame(all_data, columns=cols)
    df.to_csv(OUTPUT_FILE, index=False)
    print(f"Success! Saved {len(all_data)} hand skeletons to {OUTPUT_FILE}")
else:
    print("Failed: No hands were detected or folders were empty.")