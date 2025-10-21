import { useEffect, useRef } from "react";

const Webcam: React.FC = () => {
    const video = useRef<HTMLVideoElement | null>(null);

    async function getCameraStream() {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {width: 1280, height: 720},
            audio: false
        });
        return stream;
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
                if (video.current) {
                    video.current.srcObject = stream;
                    video.current.muted = true;
                    video.current.playsInline = true;
                    await video.current.play().catch(() => {})
                }
            } catch(e) {
                console.error(e);
            }
        };

        startCamera().catch(() => {console.error});

        return () => {
            mounted = false;
            if (stream) stream.getTracks().forEach(t => t.stop());
            if (video.current) {
                video.current.pause();
                video.current.srcObject = null;
            }
        }
    }, []);
    

    return (
        <div>
            <video
                ref={video}
                width={1280}
                height={720}
            />
        </div>
    )
}

export default Webcam;