var width = window.innerWidth;
var height = window.innerHeight;
var viewAngle = 75;
var nearClipping = 0.1;
var farClipping = 1000;

var loader = new THREE.FontLoader();

var scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

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
camera.position.set(1.1, 1.1, 1.3);
camera.lookAt(new THREE.Vector3(0, 0, 0));
controls.update();

function genSphere() {
  var txtrHW = 640;

  var txtrData = new Uint8Array(4 * txtrHW * txtrHW);
  for (var w = 0; w < txtrHW; w++) {
    for (var h = 0; h < txtrHW; h++) {
    	var stride = ((h * txtrHW) + w) * 4;
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

  var sphereTexture = new THREE.DataTexture(txtrData, txtrHW, txtrHW, THREE.RGBAFormat);
  sphereTexture.needsUpdate = true;
  var sphereMaterial = new THREE.MeshPhongMaterial({
    map: sphereTexture,
    shininess: 0.0,
    transparent: true,
    side: THREE.DoubleSide,
    depthTest: false});

  var sphereGeometry = new THREE.SphereGeometry(1.0, 64, 64);
  var local_sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  local_sphere.position.z = 0;
  local_sphere.position.x = 0;
  scene.add(local_sphere);
  return local_sphere;
}
var sphere = genSphere();

function genLine(position, lineColor, name) {
  var lineMaterial = new THREE.LineBasicMaterial({color: lineColor});
  var lineGeometry = new THREE.Geometry();
  lineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
  lineGeometry.vertices.push(position);
  var line = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(line);

  line.stateName = null;
  line.name = name;
  loader.load('three.js-master/examples/fonts/droid/droid_serif_regular.typeface.json', function (font) {
    var nameGeometry = new THREE.TextGeometry(name, {
      font: font,
      size: 0.1,
      height: 0.01 });
    var nameMaterial = new THREE.MeshPhongMaterial({color: lineColor});
    line.stateName = new THREE.Mesh(nameGeometry, nameMaterial);
    line.stateName.position.set(position.x, position.y, position.z);
    line.stateName.position.multiplyScalar(0.7);
    scene.add(line.stateName);
  });

  return line;
}
var xAxis = genLine(new THREE.Vector3(1, 0, 0), 0x44FF44, 'x');
var yAxis = genLine(new THREE.Vector3(0, 0, 1), 0xFF4444, 'y');
var zAxis = genLine(new THREE.Vector3(0, 1, 0), 0x4444FF, 'z');

var ket0, ket1;

loader.load('three.js-master/examples/fonts/droid/droid_serif_regular.typeface.json', function (font) {
  var ket0Geometry = new THREE.TextGeometry('|0>', {
    font: font,
    size: 0.1,
    height: 0.01 });
  var ket1Geometry = new THREE.TextGeometry('|1>', {
    font: font,
    size: 0.1,
    height: 0.01 });
  var ketMaterial = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
  ket0 = new THREE.Mesh(ket0Geometry, ketMaterial);
  ket0.position.set(0, 1.1, 0);
  scene.add(ket0);
  ket1 = new THREE.Mesh(ket1Geometry, ketMaterial);
  ket1.position.set(0, -1.2, 0);
  scene.add(ket1);
});

var ambiLight = new THREE.AmbientLight(0xF0F0F0);
scene.add(ambiLight);

var states = [];
function addState(x, y, z, color, name) {
  var vec = new THREE.Vector3(x, z, y); // Three.js swaps y and z for some reason
  vec.normalize();
  states.push(genLine(vec, color, name));
}
/*function removeState(name) {
  for (var i=0; i<states.length; i++) {
    if (states[i].name == name) {
      scene.remove(states[i].stateName);
      scene.remove(states[i]);
      states.splice(i, 1);
      break;
    }
  }
}*/
addState(1, 1, 1, 0xFFFF00, "|a>");
addState(1, 0, -3, 0x00FFFF, "|b>");

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  ket0.lookAt(camera.position);
  ket1.lookAt(camera.position);
  xAxis.stateName.lookAt(camera.position);
  yAxis.stateName.lookAt(camera.position);
  zAxis.stateName.lookAt(camera.position);
  for (var i=0; i<states.length; i++) {
    states[i].stateName.lookAt(camera.position);
  }
  renderer.render(scene, camera);
}
animate();
