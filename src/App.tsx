import './App.css'
import Webcam, { type FacePos } from './components/Webcam';
import Scene from './components/Scene';
import { useState } from 'react';

function App() {
  const [face, setFace] = useState<FacePos | null>(null)
  return (
    <>
      <Webcam onFace={(r) => setFace(r)}/>
      <Scene detections={face}/>
    </>
  )
}

export default App
