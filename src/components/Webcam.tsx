import { useEffect, useRef } from "react";
import useFaceDetector from "../hooks/useFaceDetector";

const Webcam: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const detectorRef = useFaceDetector();

    async function getCameraStream() {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {width: 1280, height: 720},
            audio: false
        });
        return stream;
    }

    let lastVideoTime = -1;
    
    async function detectFace() {
        const v = videoRef.current;
        const det = (detectorRef as any)?.current;
        if (!det || !v) return;
        if (v.readyState < 2 || v.videoWidth === 0 || v.videoHeight === 0) return;

        if (v.currentTime !== lastVideoTime) {
            lastVideoTime = v.currentTime;

            try {
                const res = await det.detectForVideo(v, performance.now());
                const detections = res.detections;
                console.log(res);
                console.log(detections[0]['boundingBox']);
            } catch(e) {
                console.error(e);
            }
        }
    }

    function detectionLoop() {
        detectFace();
        window.requestAnimationFrame(detectionLoop);
    }

    useEffect(() => {
        let mounted = true;
        let stream: MediaStream | null = null;

        const startCamera = async () => {
            try {
                stream = await getCameraStream();
                if (!mounted) {
                    stream.getTracks().forEach(t => t.stop());
                    return;
                }

                if (!videoRef.current) {
                    const offscreen = document.createElement('video');
                    offscreen.muted = true;
                    offscreen.playsInline = true;
                    offscreen.autoplay = true;
                    videoRef.current = offscreen;
                }

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play().catch(() => {})
                }
            } catch(e) {
                console.error(e);
            }
        };

        startCamera().catch(() => {console.error});

        detectionLoop();

        return () => {
            mounted = false;
            if (stream) stream.getTracks().forEach(t => t.stop());
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.srcObject = null;
            }
        }
    }, []);
    

    return (
        <div>
            {/* <video
                ref={videoRef}
                width={1280}
                height={720}
            /> */}
        </div>
    )
}

export default Webcam;