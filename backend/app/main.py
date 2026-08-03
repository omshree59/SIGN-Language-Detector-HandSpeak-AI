from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json

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