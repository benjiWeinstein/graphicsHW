import {OrbitControls} from './OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

// Add here the rendering of your spaceship

// This is a sample box.
const ambient = new THREE.AmbientLight({color: 0x00ff00})
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshStandardMaterial( {color: 0x00ff00, wireframe: true} );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube, ambient );

const geometry2 = new THREE.ConeGeometry( 5, 20, 32 );
const material2 = new THREE.MeshBasicMaterial( {color: 0xffff00} );
const cone = new THREE.Mesh( geometry2, material2 );
cone.applyMatrix4(new THREE.Matrix4().makeTranslation(5,0,0))
scene.add( cone );



// This defines the initial distance of the camera

const cameraTranslate = new THREE.Matrix4();
cameraTranslate.makeTranslation(0,0,5);
camera.applyMatrix4(cameraTranslate)

renderer.render( scene, camera );

const controls = new OrbitControls( camera, renderer.domElement );

let isOrbitEnabled = true;

const toggleOrbit = (e) => {
	if (e.key == "o"){
		isOrbitEnabled = !isOrbitEnabled;
	}
}

document.addEventListener('keydown',toggleOrbit)

//controls.update() must be called after any manual changes to the camera's transform
controls.update();

function animate() {

	requestAnimationFrame( animate );

	controls.enabled = isOrbitEnabled;
	controls.update();

	renderer.render( scene, camera );

}
animate()