from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import wordninja

# Import the prediction function from our ml_engine
from app.ml_engine import predict_sign

app = FastAPI(title="ASL to Text API")

# Allow our React frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SentenceRequest(BaseModel):
    raw_sentence: str

class TeachRequest(BaseModel):
    word: str
    landmarks: list[float]

@app.post("/api/teach-sign")
def teach_sign(request: TeachRequest):
    from app.ml_engine import teach_custom_sign
    if len(request.landmarks) != 63:
        return {"error": "Invalid landmarks length. Expected 63."}
    
    teach_custom_sign(request.word, request.landmarks)
    return {"message": f"Successfully taught the sign for '{request.word}'!"}

@app.post("/api/convert-sentence")
def convert_sentence(request: SentenceRequest):
    # wordninja probabilistically splits concatenated words
    # e.g., "iamgoodboy" -> ["i", "am", "good", "boy"]
    words = wordninja.split(request.raw_sentence.lower())
    
    # Capitalize the first letter of the sentence, keep the rest lower
    sentence = " ".join(words)
    if sentence:
        sentence = sentence[0].upper() + sentence[1:]
        
    return {"converted_sentence": sentence}

@app.get("/")
def read_root():
    return {"message": "ASL to Text API is running! Connect via WebSockets at /ws/predict"}

@app.websocket("/ws/predict")
async def websocket_predict(websocket: WebSocket):
    await websocket.accept()
    print("📱 Client connected to WebSocket!")
    
    try:
        while True:
            # Receive data from the frontend
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            # Extract the 63 landmarks
            landmarks = payload.get("landmarks", [])
            
            if len(landmarks) == 63:
                # Ask PyTorch what letter this is
                letter, confidence = predict_sign(landmarks)
                
                # Send the answer back to the frontend
                await websocket.send_json({
                    "predicted_character": letter,
                    "confidence": confidence
                })
            else:
                await websocket.send_json({
                    "error": "Invalid landmark data length. Expected 63."
                })
                
    except WebSocketDisconnect:
        print("📱 Client disconnected from WebSocket.")
    except Exception as e:
        print(f"⚠️ WebSocket Error: {e}")