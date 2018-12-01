var width = window.innerWidth;
var height = window.innerHeight;
var viewAngle = 75;
var nearClipping = 0.1;
var farClipping = 1000;

var scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

var camera = new THREE.PerspectiveCamera(viewAngle, width / height, nearClipping, farClipping);

var renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
var blockedAngle = 0.25;
controls.minPolarAngle = blockedAngle;
controls.maxPolarAngle = Math.PI - blockedAngle;
controls.minDistance = 1.2;
controls.maxDistance = 4;
camera.position.set(2, 0, 0);
camera.lookAt(new THREE.Vector3(0, 0, 0));
controls.update();

function genSphere() {
  var txtrWidth = 1280;
  var txtrHeight = 720;
  var sphereGeometry = new THREE.SphereGeometry(1.0, 64, 64);

  var txtrData = new Uint8Array(4 * txtrWidth * txtrHeight);
  for (var w = 0; w < txtrWidth; w++) {
    for (var h = 0; h < txtrHeight; h++) {
    	var stride = ((h * txtrWidth) + w) * 4;
    	txtrData[stride] = 255; // r; rgb is 0...255
    	txtrData[stride + 1] = 255; // g
      txtrData[stride + 2] = 255; // b
      if (w % 40 && h % 40) {
        txtrData[stride + 3] = 0; // a
      } else {
        txtrData[stride + 3] = 255; // a
      }
    }
  }

  var sphereTexture = new THREE.DataTexture(txtrData, txtrWidth, txtrHeight, THREE.RGBAFormat);
  sphereTexture.needsUpdate = true;
  var sphereMaterial = new THREE.MeshPhongMaterial({
    map: sphereTexture,
    shininess: 0.0,
    transparent: true});
  var testMat = new THREE.MeshBasicMaterial();
  testMat.color = new THREE.Color(0x00FF00);
  var local_sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  local_sphere.position.z = 0;
  local_sphere.position.x = 0;
  scene.add(local_sphere);
  return local_sphere;
}
var sphere = genSphere();

var ambiLight = new THREE.AmbientLight(0xA0A0A0);
scene.add(ambiLight);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
