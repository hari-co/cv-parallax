import { useEffect, useRef } from "react";
import {
  FaceDetector,
  FilesetResolver
} from "@mediapipe/tasks-vision"

export default function useFaceDetector() {
    const fd = useRef<FaceDetector | null>(null);
    
    useEffect(() => {

    let mounted = true;

      const initFaceDetector = async () => {
        try {
          const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
          );
          const faceDetector = await FaceDetector.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: './blaze_face_short_range.tflite'
            },
            runningMode: "VIDEO"
          });

          if (mounted) {fd.current = faceDetector}
        } catch(e) {
            console.error(e);
        }
      }

    initFaceDetector().catch(console.error);

    return () => {
      mounted = false;
      fd.current?.close?.();
      fd.current = null;
    }
  }, []);

  return fd;
}