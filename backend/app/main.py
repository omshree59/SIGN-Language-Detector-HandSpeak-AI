from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import json
import os
import wordninja

# Import the prediction function from our ml_engine
from app.ml_engine import predict_sign

app = FastAPI(title="ASL to Text API")

# Mount static directory for model training metric images
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(STATIC_DIR):
    os.makedirs(STATIC_DIR)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

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

def smooth_asl_grammar(words):
    import nltk
    if not words:
        return ""
    try:
        tagged = nltk.pos_tag(words)
    except Exception:
        return " ".join(words)
        
    # Rule 1: OSV (Object-Subject-Verb) -> SVO (Subject-Verb-Object)
    # ASL: "store i go" -> "i go to the store"
    if len(tagged) == 3:
        if tagged[0][1].startswith('N') and tagged[1][1].startswith('PRP') and tagged[2][1].startswith('V'):
            obj = tagged[0][0]
            subj = tagged[1][0]
            verb = tagged[2][0]
            if verb.lower() in ['go', 'walk', 'run', 'drive', 'travel', 'move']:
                return f"{subj} {verb} to the {obj}"
            else:
                return f"{subj} {verb} the {obj}"

    # Rule 2: Noun + Adjective -> Adjective + Noun
    # ASL: "car red" -> "red car"
    if len(tagged) == 2:
        if tagged[0][1].startswith('N') and tagged[1][1].startswith('JJ'):
            return f"{tagged[1][0]} {tagged[0][0]}"

    # Rule 3: Pronoun + Adjective (Missing "to be" verbs)
    # ASL: "i happy" -> "i am happy"
    if len(tagged) == 2:
        if tagged[0][1].startswith('PRP') and tagged[1][1].startswith('JJ'):
            pronoun = tagged[0][0].lower()
            if pronoun == 'i':
                verb = 'am'
            elif pronoun in ['he', 'she', 'it']:
                verb = 'is'
            else:
                verb = 'are'
            return f"{tagged[0][0]} {verb} {tagged[1][0]}"

    # Rule 4: Pronoun + Noun (Missing "to be" and article)
    # ASL: "he doctor" -> "he is a doctor"
    if len(tagged) == 2:
        if tagged[0][1].startswith('PRP') and tagged[1][1].startswith('N'):
            pronoun = tagged[0][0].lower()
            if pronoun == 'i':
                verb = 'am a'
            elif pronoun in ['he', 'she', 'it']:
                verb = 'is a'
            else:
                verb = 'are'
            return f"{tagged[0][0]} {verb} {tagged[1][0]}"

    # Fallback to just joining the words
    return " ".join(words)

@app.post("/api/convert-sentence")
def convert_sentence(request: SentenceRequest):
    # 1. Split concatenated letters into words (e.g. "storeigo" -> ["store", "i", "go"])
    words = wordninja.split(request.raw_sentence.lower())
    
    # 2. Smooth the ASL grammar into English grammar
    sentence = smooth_asl_grammar(words)
    
    # 3. Capitalize the first letter
    if sentence:
        sentence = sentence[0].upper() + sentence[1:]
        
    return {"converted_sentence": sentence}

@app.post("/api/dictionary")
def get_dictionary(request: SentenceRequest):
    import string
    from nltk.corpus import wordnet as wn
    
    # Split the sentence into words
    words = request.raw_sentence.lower().translate(str.maketrans('', '', string.punctuation)).split()
    
    # Hardcoded fallbacks for common conversational words/pronouns not in WordNet
    fallbacks = {
        "i": "Pronoun: used by a speaker to refer to himself or herself.",
        "you": "Pronoun: used to refer to the person or people that the speaker is addressing.",
        "he": "Pronoun: used to refer to a man, boy, or male animal.",
        "she": "Pronoun: used to refer to a woman, girl, or female animal.",
        "it": "Pronoun: used to refer to a thing previously mentioned or easily identified.",
        "we": "Pronoun: used by a speaker to refer to himself or herself and one or more other people.",
        "they": "Pronoun: used to refer to two or more people or things previously mentioned.",
        "am": "Verb: first person singular present of be.",
        "is": "Verb: third person singular present of be.",
        "are": "Verb: second person singular present and first, second, third person plural present of be."
    }
    
    definitions = []
    for w in words:
        if w in fallbacks:
            definitions.append({"word": w, "definition": fallbacks[w]})
            continue
            
        syns = wn.synsets(w)
        if syns:
            # Get the first noun/verb definition if possible
            best_def = syns[0].definition()
            definitions.append({"word": w, "definition": best_def.capitalize() + "."})
        else:
            definitions.append({"word": w, "definition": "No offline definition available."})
            
    return {"definitions": definitions}

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