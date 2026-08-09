import { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import Header from "./components/Header";
import CameraPanel from "./components/CameraPanel";
import PredictionPanel from "./components/PredictionPanel";
import SentencePanel from "./components/SentencePanel";
import Footer from "./components/Footer";
import Background from "./components/Background";



const WS_URL = 'ws://127.0.0.1:8000/ws/predict';

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
const animationFrameRef = useRef<number | null>(null);

  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [backendStatus, setBackendStatus] = useState<
  "connecting" | "connected" | "offline"
>("connecting");
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
  let ws: WebSocket;

  const connect = () => {
    setBackendStatus("connecting");



    ws = new WebSocket(WS_URL);
    let reconnectTimer: ReturnType<typeof setTimeout>;

    ws.onopen = () => {
      console.log("Connected");
      setBackendStatus("connected");
    };

    ws.onclose = () => {
      console.log("Disconnected");
      setBackendStatus("offline");

      // Try again after 2 seconds
      setTimeout(connect, 2000);
    };

    ws.onerror = () => {
      setBackendStatus("offline");
      ws.close();
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.predicted_character) {
        setCurrentSign(data.predicted_character);
        setConfidence(data.confidence);

        setConfidenceHistory(prev => {
          const updated = [...prev, data.confidence];
          return updated.slice(-40);
        });

        if (
          data.predicted_character === stableCharRef.current &&
          data.confidence > 80
        ) {
          holdCountRef.current++;

          if (holdCountRef.current === HOLD_THRESHOLD) {
            setSentence(prev => prev + data.predicted_character);
            holdCountRef.current = 0;
          }
        } else {
          stableCharRef.current = data.predicted_character;
          holdCountRef.current = 0;
        }

        setUiHoldCount(holdCountRef.current);
      }
    };

    wsRef.current = ws;
  };

  connect();

  return () =>{}
     clearTimeout(reconnectTimer); ws?.close();
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
        
        const distances = shiftedPoints.map(pt => Math.sqrt(pt[0]*pt[0] + pt[1]*pt[1] + pt[2]*pt[2]));
        const maxDistance = Math.max(...distances);
        
        let flatList: number[] = [];
        if (maxDistance > 0) {
          shiftedPoints.forEach(pt => {
            flatList.push(pt[0] / maxDistance, pt[1] / maxDistance, pt[2] / maxDistance);
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
      position: "relative",
      minHeight: "100vh",
      background: `
        radial-gradient(
          circle at top left,
          rgba(249, 115, 22, 0.12),
          transparent 35%
        ),

        radial-gradient(
          circle at bottom right,
          rgba(234, 88, 12, 0.1),
          transparent 35%
        ),

        #FFF7ED
      `,
      overflow: "hidden",
    }}
  >

    {/* =========================
        FLOATING BACKGROUND
        ========================= */}

    <Background />


    {/* =========================
        MAIN WEBSITE CONTENT
        ========================= */}

    <div
      style={{
        position: "relative",
        zIndex: 2,

        maxWidth: "1600px",
        margin: "0 auto",

        padding: "30px",
      }}
    >

      <Header backendStatus={backendStatus} />


      {/* Main Dashboard */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.7fr 1fr",
          gap: "24px",
          alignItems: "stretch",
        }}
      >

        {/* Left column */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >

          <CameraPanel
            videoRef={videoRef}
            canvasRef={canvasRef}
            isModelLoaded={isModelLoaded}
            currentSign={currentSign}
            confidence={confidence}
            isCameraActive={isCameraActive}
            toggleCamera={toggleCamera}
          />


          <SentencePanel
            sentence={sentence}
            setSentence={setSentence}
            uiHoldCount={uiHoldCount}
            HOLD_THRESHOLD={HOLD_THRESHOLD}
            confidence={confidence}
          />

        </div>


        {/* Right column */}

        <PredictionPanel
          currentSign={currentSign}
          confidence={confidence}
          confidenceHistory={confidenceHistory}
          isModelLoaded={isModelLoaded}
          isCameraActive={isCameraActive}
        />

      </div>


      <Footer />

    </div>

  </div>
);
}
