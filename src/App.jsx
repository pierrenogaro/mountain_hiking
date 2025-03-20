import { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function App() {
    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 7, 4);

        const background = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = canvas.height = 1024;

            ctx.fillStyle = '#010c19';
            ctx.fillRect(0, 0, 1024, 1024);

            for (let i = 0; i < 400; i++) {
                ctx.fillStyle = 'yellow';
                ctx.beginPath();
                ctx.arc(Math.random() * 1024, Math.random() * 1024, Math.random() * 2, 0, Math.PI * 2);
                ctx.fill();
            }
            return new THREE.CanvasTexture(canvas);
        };

        scene.background = background();
        const canvas = document.getElementById("myThreeJsCanvas");
        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);

        const spotLight = new THREE.SpotLight(0xffffff, 1);
        spotLight.position.set(0, 64, 32);
        scene.add(spotLight);

        const controls = new OrbitControls(camera, canvas);
        controls.update();

        const rockyLoader = new GLTFLoader();
        rockyLoader.load('/rocky_path.glb', function (gltf) {
            scene.add(gltf.scene);
        }, undefined, function (error) {
            console.error('Error loading path model:', error);
        });

        let character = null;
        const moveSpeed = 0.09;

        const manLoader = new GLTFLoader();
        manLoader.load('/mr_man_walking.glb', function (gltf) {
            gltf.scene.scale.set(0.004, 0.004, 0.004);
            gltf.scene.position.set(0, 0.45, 0);
            character = gltf.scene;
            scene.add(character);
        }, undefined, function (error) {
            console.error('Error loading model:', error);
        });

        const moveKey = (event) => {
            if (!character) return;

            switch(event.key.toLowerCase()) {
                case 'z':
                    character.position.z -= moveSpeed;
                    character.rotation.y = Math.PI;
                    break;
                case 's':
                    character.position.z += moveSpeed;
                    character.rotation.y = 0;
                    break;
                case 'q':
                    character.position.x -= moveSpeed;
                    character.rotation.y = -Math.PI/2;
                    break;
                case 'd':
                    character.position.x += moveSpeed;
                    character.rotation.y = Math.PI/2;
                    break;
            }
        };

        window.moveBtn = (direction) => {
            if (!character) return;

            switch(direction) {
                case 'up':
                    character.position.z -= moveSpeed;
                    character.rotation.y = Math.PI;
                    break;
                case 'down':
                    character.position.z += moveSpeed;
                    character.rotation.y = 0;
                    break;
                case 'left':
                    character.position.x -= moveSpeed;
                    character.rotation.y = -Math.PI/2;
                    break;
                case 'right':
                    character.position.x += moveSpeed;
                    character.rotation.y = Math.PI/2;
                    break;
            }
        };

        window.addEventListener('keydown', moveKey);

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('keydown', moveKey);
        };
    }, []);

    const btnStyle = {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        fontSize: '20px',
        border: 'none',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        margin: '2px'
    };

    return (
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'fixed', top: 0, left: 0, margin: 0, padding: 0 }}>
            <canvas id="myThreeJsCanvas" style={{ display: 'block' }} />
            <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '5px' }}>
                Contrôles: Z/↑  S/↓  Q/←  D/→
            </div>

            <div style={{ position: 'absolute', bottom: '100px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                <button onClick={() => window.moveBtn('up')} style={btnStyle}>↑</button>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={() => window.moveBtn('left')} style={btnStyle}>←</button>
                    <button onClick={() => window.moveBtn('down')} style={btnStyle}>↓</button>
                    <button onClick={() => window.moveBtn('right')} style={btnStyle}>→</button>
                </div>
            </div>
        </div>
    );
}

export default App;