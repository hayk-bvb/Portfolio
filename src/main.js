import * as THREE from 'three';

// 1️⃣ Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
  canvas: document.querySelector('#background'),
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
camera.position.set(0, 0, 70); // Move camera back to view larger object

// 2️⃣ Geometry (Icosahedron)
const geometry = new THREE.IcosahedronGeometry(20, 0); // Radius of 20
const material = new THREE.MeshStandardMaterial({ 
  color: 0xff0000, 
  wireframe: true // Turn off default wireframe
});
const icosahedron = new THREE.Mesh(geometry, material);
icosahedron.position.set(0, 0, 0); 
icosahedron.scale.set(2, 2, 2); // Scale it up 2x
scene.add(icosahedron);

// 2️⃣.1 Edges for Thicker Wireframe
const edges = new THREE.EdgesGeometry(geometry); // Get edges of geometry
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 }); // White lines, thicker
const wireframe = new THREE.LineSegments(edges, lineMaterial);
scene.add(wireframe);

const lineMaterial2 = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 3}); // White lines, thicker
const wireframe2 = new THREE.LineSegments(edges, lineMaterial2);

scene.add(wireframe2)


// 3️⃣ Lights
const pointLight = new THREE.PointLight(0xffffff, 1.5); 
pointLight.position.set(50, 50, 50);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// 4️⃣ Background Stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}
Array(200).fill().forEach(addStar);

// // 5️⃣ Scroll Animation
// function moveCamera() {
//   const t = document.body.getBoundingClientRect().top;
//   camera.position.z = t * -0.01 + 70;
//   camera.position.x = t * -0.002;
//   camera.position.y = t * -0.002;
// }
// document.body.onscroll = moveCamera;

// 6️⃣ Animation Loop
function animate() {
  requestAnimationFrame(animate);
  icosahedron.rotation.x += 0.0001;
  icosahedron.rotation.y += 0.0001;
  icosahedron.rotation.z += 0.0001;

  wireframe.rotation.x += 0.002;
  wireframe.rotation.y += 0.002;
  wireframe.rotation.z += 0.002;

  renderer.render(scene, camera);
}
animate();

// 🖱️ Mouse-controlled rotation
document.addEventListener('mousemove', (event) => {
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  icosahedron.rotation.x = mouseY * 0.5;
  icosahedron.rotation.y = mouseX * 0.5;
  wireframe.rotation.x = mouseY * 0.5;
  wireframe.rotation.y = mouseX * 0.5;
});

// 📏 Handle Resizing
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});