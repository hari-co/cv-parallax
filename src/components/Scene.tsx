import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { ThreeElements } from '@react-three/fiber'
import type { FacePos } from './Webcam'

export default function Scene({ detections }: { detections?: FacePos | null}) {
    function Box(props: ThreeElements['mesh'] & { face?: FacePos | null }) {
        const meshRef = useRef<THREE.Mesh>(null!)
        const [hovered, setHover] = useState(false)
        const [active, setActive] = useState(false)
        useFrame((state, delta) => {
            if (detections) {
                meshRef.current.position.x = -5 + detections.x/100;
                meshRef.current.position.y = -2 + detections.y/100;
                console.log(detections.x);
            }
        })
        return (
        <mesh
            {...props}
            ref={meshRef}
            scale={active ? 5 : 2}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : '#2f74c0'} />
        </mesh>
        )
    }
    
    return (
        <Canvas
            style={{position: 'fixed', inset: 0, width: '100%', height: '100%', display: 'block'}}>
            <ambientLight intensity={Math.PI / 2}/>
            <Box position={[0,0,-5]}/>
        </Canvas>
    )
}