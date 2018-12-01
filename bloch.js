/*global window, THREE, document, Uint8Array*/
/*jslint indent: 2 */
var width = window.innerWidth;
var height = window.innerHeight;
var viewAngle = 75;
var nearClipping = 0.1;
var farClipping = 1000;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(viewAngle, width / height, nearClipping, farClipping);

var renderer = new THREE.WebGLRenderer();
//renderer.setClearColor(0xFFFFFF);

renderer.setPixelRatio(window.devicePixelRatio / 2);
document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
var blockedAngle = 0.25;
controls.minPolarAngle = blockedAngle;
controls.maxPolarAngle = Math.PI - blockedAngle;
controls.minDistance = 1.2;
controls.maxDistance = 4;
camera.position.set(4, 0, 0);
camera.lookAt(new THREE.Vector3(0, 0, 0));
controls.update();

function genSphere() {
  //"use strict";
  var txtrHW = 1000;
  var sphereGeometry = new THREE.SphereGeometry(1.0, 64, 64);

  var txtrData = new Uint8Array(4 * txtrHW*txtrHW);
  for (var w = 0; w < txtrHW; w++) {
    for (var h = 0; h < txtrHW; h++) {
    	var stride = (h * txtrHW + w) * 4;
    	txtrData[stride] = 200; // r; rgb is 0...255
    	txtrData[stride + 1] = 200; // g
      txtrData[stride + 2] = 200; // b
      txtrData[stride + 3] = 200; // a
    }
  }

  var sphereTexture = new THREE.DataTexture(txtrData, txtrHW, txtrHW, THREE.RGBAFormat);
  var sphereMaterial = new THREE.MeshPhongMaterial({
    map: sphereTexture,
    shininess: 0.0,
    transparent: true});
  //var testMat = new MeshBasicMaterial();
  //testMat.color(0xffffff);
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
