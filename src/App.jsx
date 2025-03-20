import { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function App() {
    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 7, 4);
        scene.background = new THREE.Color(0x87ceeb);

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

    return (
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'fixed', top: 0, left: 0, margin: 0, padding: 0 }}>
            <canvas id="myThreeJsCanvas" style={{ display: 'block' }} />
            <div style={{ position: 'absolute', bottom: '10px', left: '10px', color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '5px' }}>
                Contrôles: Z/↑ (avancer), S/↓ (reculer), Q/← (gauche), D/→ (droite)
            </div>
        </div>
    );
}

export default App;