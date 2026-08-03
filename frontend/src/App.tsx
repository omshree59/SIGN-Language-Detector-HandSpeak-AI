import { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import Header from "./components/Header";
import CameraPanel from "./components/CameraPanel";
import PredictionPanel from "./components/PredictionPanel";
import SentencePanel from "./components/SentencePanel";
import Footer from "./components/Footer";



const WS_URL = 'ws://127.0.0.1:8000/ws/predict';

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
const animationFrameRef = useRef<number | null>(null);

  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [currentSign, setCurrentSign] = useState<string>('-');
  const [confidence, setConfidence] = useState<number>(0);
  const [confidenceHistory, setConfidenceHistory] = useState<number[]>([]);
  const [sentence, setSentence] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);

  // Debounce/Hold Stabilizer State
  const holdCountRef = useRef<number>(0);
  const stableCharRef = useRef<string>('');
  const [uiHoldCount, setUiHoldCount] = useState<number>(0);
  const HOLD_THRESHOLD = 15; // Requires ~0.5 seconds of holding the exact same sign
  const isCameraActiveRef = useRef(true);

  useEffect(() => {
    // Connect to Python Backend natively (removes the buggy library dependency)
    const ws = new WebSocket(WS_URL);
    
    ws.onopen = () => console.log('Connected to Python WebSocket');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.predicted_character) {
        setCurrentSign(data.predicted_character);
        setConfidence(data.confidence);
        setConfidenceHistory((prev) => {
  const updated = [...prev, data.confidence];
  return updated.slice(-40); // Keep only last 40 values
});
        
        // Hold Stabilizer Logic
        if (data.predicted_character === stableCharRef.current && data.confidence > 80) {
          holdCountRef.current += 1;
          if (holdCountRef.current === HOLD_THRESHOLD) {
            setSentence((prev) => prev + data.predicted_character);
            holdCountRef.current = 0; // Reset after appending
          }
        } else {
          stableCharRef.current = data.predicted_character;
          holdCountRef.current = 0;
        }
        setUiHoldCount(holdCountRef.current);
      }
    };
    
    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  
    const initializeMediaPipe = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      );
      handLandmarkerRef.current =
await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 1,
      });
      setIsModelLoaded(true);
      startCamera();
    };

const startCamera = async () => {
  isCameraActiveRef.current = true;
  setIsCameraActive(true);

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;

      await videoRef.current.play();

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      predictWebcam();
    }
  }
};

    const predictWebcam = async () => {
if (
  !isCameraActiveRef.current ||
  !videoRef.current ||
  !canvasRef.current ||
  !handLandmarkerRef.current
) {
  return;
}
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      let startTimeMs = performance.now();
      const results =
handLandmarkerRef.current.detectForVideo(
    video,
    startTimeMs
);  
      
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      
      if (results.landmarks && results.landmarks.length > 0) {
        const landmarks = results.landmarks[0];
        
        // Draw Skeleton
        ctx!.fillStyle = "#00FF00";
        for (const landmark of landmarks) {
          ctx!.beginPath();
          ctx!.arc(landmark.x * canvas.width, landmark.y * canvas.height, 5, 0, 2 * Math.PI);
          ctx!.fill();
        }

        // Normalize and send to Python backend
        const rawPoints = landmarks.map(lm => [lm.x, lm.y, lm.z]);
        const wrist = rawPoints[0];
        const shiftedPoints = rawPoints.map(pt => [pt[0] - wrist[0], pt[1] - wrist[1], pt[2] - wrist[2]]);
        
        const xs = shiftedPoints.map(pt => pt[0]);
        const ys = shiftedPoints.map(pt => pt[1]);
        const minX = Math.min(...xs), maxX = Math.max(...xs);
        const minY = Math.min(...ys), maxY = Math.max(...ys);
        
        const diagonal = Math.sqrt(Math.pow(maxX - minX, 2) + Math.pow(maxY - minY, 2));
        
        let flatList: number[] = [];
        if (diagonal > 0) {
          shiftedPoints.forEach(pt => {
            flatList.push(pt[0] / diagonal, pt[1] / diagonal, pt[2] / diagonal);
          });
        }
        
        // Send exactly 63 coordinates to Python
        if (flatList.length === 63 && wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ landmarks: flatList }));
        }
      }
      
      animationFrameRef.current =
requestAnimationFrame(predictWebcam);
    };
  useEffect(() => {
  initializeMediaPipe();

  return () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    handLandmarkerRef.current?.close();
  };
}, []);


const toggleCamera = async () => {
  if (isCameraActive) {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }


    isCameraActiveRef.current = false;
setIsCameraActive(false);
    setCurrentSign("-");
    setConfidence(0);
  } else {
  await startCamera();
}
};
  return (
  <div
    style={{
      minHeight: "100vh",
      background: "#020617",
      color: "#fff",
      padding: "30px",
    }}
  >
    <div
      style={{
        maxWidth: "1600px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <Header />

      {/* Main Dashboard */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.7fr 1fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <CameraPanel
            videoRef={videoRef}
            canvasRef={canvasRef}
            isModelLoaded={isModelLoaded}
            currentSign={currentSign}
            confidence={confidence}
            isCameraActive={isCameraActive}
            toggleCamera={toggleCamera}
          />

          {/* Sentence Builder */}
          <SentencePanel
            sentence={sentence}
            setSentence={setSentence}
            uiHoldCount={uiHoldCount}
            HOLD_THRESHOLD={HOLD_THRESHOLD}
            confidence={confidence}
          />
        </div>

        <PredictionPanel
          currentSign={currentSign}
          confidence={confidence}
          confidenceHistory={confidenceHistory}
          isModelLoaded={isModelLoaded}
          isCameraActive={isCameraActive}
/>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  </div>
);
}