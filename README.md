# 🤟 HandSpeak AI

> A real-time AI-powered Sign Language Translation platform built with React, FastAPI, MediaPipe, and PyTorch.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Python](https://img.shields.io/badge/Python-3.11+-yellow)
![React](https://img.shields.io/badge/React-19-61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-0.116-009688)
![PyTorch](https://img.shields.io/badge/PyTorch-2.x-red)

---

## 📖 Overview

HandSpeak AI is an intelligent sign language recognition system that translates hand gestures into text in real time using computer vision and deep learning.

The application captures live webcam input, detects hand landmarks using MediaPipe, classifies gestures using a trained PyTorch model, and displays translated text through an interactive dashboard.

---

## ✨ Features

- 🎥 Live webcam sign detection
- 🖐️ MediaPipe hand landmark tracking
- 🧠 PyTorch gesture classification
- ⚡ FastAPI backend with WebSocket communication
- 📊 Live AI analytics dashboard
- 📝 Sentence builder
- 🔊 Text-to-Speech support
- 📋 Copy translation
- 📁 Export translated text
- 📈 Confidence monitoring
- 🚀 Modern responsive UI

---

# 🖥️ Dashboard

### Home Dashboard

- Live Camera Feed
- AI Prediction Panel
- Analytics Dashboard
- Sentence Builder
- AI Health Monitoring

---

# 🏗️ Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Framer Motion
- Lucide Icons
- Tailwind CSS

---

## Backend

- FastAPI
- Python
- WebSockets
- Uvicorn

---

## AI / ML

- PyTorch
- MediaPipe
- OpenCV
- NumPy

---

# 📂 Project Structure

```text
asl-translator-mvp/
│
├── backend/
│   ├── app/
│   ├── ml/
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

# ⚙️ Installation

## 1 Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/HandSpeak-AI.git
cd HandSpeak-AI
```

---

## 2 Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run backend

```bash
uvicorn backend.app.main:app --reload --port 8000
```

---

## 3 Frontend Setup

```bash
cd frontend

npm install
```

Run development server

```bash
npm run dev
```

---

# 🚀 Usage

1. Start the FastAPI backend.
2. Start the React frontend.
3. Allow webcam permission.
4. Show ASL hand gestures.
5. Watch live predictions.
6. Build complete sentences.
7. Copy, Speak or Export the translated text.

---

# 📊 AI Pipeline

```text
Webcam
   │
   ▼
MediaPipe Hand Detection
   │
   ▼
21 Hand Landmarks
   │
   ▼
Landmark Normalization
   │
   ▼
PyTorch Model
   │
   ▼
Prediction
   │
   ▼
FastAPI WebSocket
   │
   ▼
React Dashboard
```

---

# 📸 Screenshots

Add screenshots here after deployment.

Example:

```
screenshots/
    dashboard.png
    analytics.png
    sentence-builder.png
```

---

# 🔮 Future Improvements

- Voice Translation
- Multi-language Support
- Word Prediction
- Sentence Auto Correction
- Mobile Application
- Cloud Deployment
- Gesture History
- User Authentication

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push to your branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 📜 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Omshree Parida**

Computer Science Engineering (AI & ML)

VIT-AP University

GitHub:
https://github.com/omshree59

LinkedIn:
https://linkedin.com/in/your-linkedin

---

⭐ If you found this project useful, don't forget to star the repository!
