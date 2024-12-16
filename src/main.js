import * as THREE from 'three';

// 1. Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
  canvas: document.querySelector('#background'),
  // alpha: true
});


// Set initial renderer size and pixel ratio
function resizeRenderer() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const dpr = window.devicePixelRatio || 1;
  
  renderer.setSize(width, height);
  renderer.setPixelRatio(dpr); // High-DPI scaling for Retina
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

resizeRenderer(); // Call once on page load

// Add resize event listener (debounced to avoid performance issues)
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => resizeRenderer(), 200);
});

camera.position.setZ(30);

// 2. Add Geometry (Floating Objects)
const geometry = new THREE.TorusGeometry(10, 3, 16, 100); 
const material = new THREE.MeshStandardMaterial({ 
  color: 0x6347ff, 
  wireframe: true // This makes it look like a net 
});
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// 3. Lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(50, 50, 50);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

// 4. Background Stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// 5. Scroll Animation
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  camera.position.z = t * -0.01 + 30;
  camera.position.x = t * -0.002;
  camera.position.y = t * -0.002;
}

document.body.onscroll = moveCamera;

// 6. Animation Loop
function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.0001;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.0001;

  renderer.render(scene, camera);
}

animate();

// Mouse-controlled rotation
document.addEventListener('mousemove', (event) => {
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  
  torus.rotation.x = mouseY * 0.5;
  torus.rotation.y = mouseX * 0.5;
});

// Handle Resizing (Debounced)
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => resizeRenderer(), 200);
});