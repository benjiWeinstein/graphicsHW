// import { BufferGeometry } from 'three';
import {OrbitControls} from './OrbitControls.js'

// init scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild( renderer.domElement );

let ROTATE_Z, HELPERS = false
let ROTATE_X, SHOW_STARS = true 


function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

// Add here the rendering of your spaceship

	const pointlight = new THREE.PointLight(0xffffff, 1.2)
	pointlight.position.set(60, 100, 30)
	scene.add(pointlight)
	const pointlight2 = new THREE.PointLight(0xffffff, 1.2)
	pointlight2.position.set(60, 100, 100)
	scene.add(pointlight2)

	let geometry = new THREE.SphereGeometry( 5, 32, 16 );
	let material = new THREE.MeshPhongMaterial( { color: 0x54819c} );
	const sphere = new THREE.Mesh( geometry, material );
	sphere.name = 'Planet'
	sphere.applyMatrix4(new THREE.Matrix4().makeTranslation(10,10,10))
	sphere.applyMatrix4(new THREE.Matrix4().makeScale(5,5,5))

	const shipGroup = new THREE.Group()
	shipGroup.name = 'Ship'
	geometry = new THREE.ConeGeometry( 5, 15, 32 );
	material = new THREE.MeshPhongMaterial( {color: 0xffff00} );
	const cone = new THREE.Mesh( geometry, material );
	cone.name = "Ship head"
	cone.applyMatrix4(new THREE.Matrix4().makeTranslation(5,12.5,5))

	geometry = new THREE.CylinderGeometry( 5, 5, 15, 32 );
	material = new THREE.MeshPhongMaterial( {color: 0xffaf00} );
	const cylinder = new THREE.Mesh( geometry, material );
	cylinder.name = "Ship body"
	cylinder.applyMatrix4(new THREE.Matrix4().makeTranslation(5,-2.5,5))

	const windows = new THREE.Group()
	geometry = new THREE.RingGeometry( 3, 5, 32 );
	material = new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide } );
	const window1 = new THREE.Mesh( geometry, material );
	window1.applyMatrix4(new THREE.Matrix4().makeScale(0.3,0.3,0.3))
	window1.applyMatrix4(new THREE.Matrix4().makeTranslation(5,18,10))
	
	const window2 = new THREE.Mesh( geometry, material );
	window2.applyMatrix4(new THREE.Matrix4().makeScale(0.3,0.3,0.3))
	window2.applyMatrix4(new THREE.Matrix4().makeTranslation(5,14,10))

	windows.add( window1,window2 );


	function constructTriangle(){
		const group = new THREE.Group()
		geometry = new THREE.BufferGeometry();
		const geometryCopy = new THREE.BufferGeometry();
		const v1 = [0, 0, 0];
		const v2 = [10, 0, 0];
		const v3 = [10, 10, 0];
		material = new THREE.MeshBasicMaterial({color:0xffffff})
		geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([...v1, ...v2, ...v3]),3))
		const mesh1 = new THREE.Mesh(geometry,material)
		const material2 = new THREE.MeshBasicMaterial({color:0xffffff})
		geometryCopy.setAttribute('position', new THREE.BufferAttribute(new Float32Array([...v2, ...v1, ...v3]),3))
		const mesh2 = new THREE.Mesh(geometryCopy,material)
		group.add(mesh1,mesh2)
		return group
	}
	function createTriangles(){
		const tri1 = constructTriangle()
		tri1.applyMatrix4(new THREE.Matrix4().makeTranslation(-6,5,5))
	
		const tri2 = constructTriangle()
		tri2.applyMatrix4(new THREE.Matrix4().makeRotationY(degrees_to_radians(180)))
		tri2.applyMatrix4(new THREE.Matrix4().makeTranslation(16,5,5))
	
		const tri3 = constructTriangle()
		tri3.applyMatrix4(new THREE.Matrix4().makeRotationY(degrees_to_radians(90)))
		tri3.applyMatrix4(new THREE.Matrix4().makeTranslation(5,5,16))
	
		const tri4 = constructTriangle()
		tri4.applyMatrix4(new THREE.Matrix4().makeRotationY(degrees_to_radians(270)))
		tri4.applyMatrix4(new THREE.Matrix4().makeTranslation(5,5,-6))
		return {tri1,tri2,tri3,tri4}
	}

	const {tri1,tri2,tri3,tri4} = createTriangles()
	const wings = new THREE.Group()
	wings.add(tri1,tri2,tri3,tri4)
	const hull = new THREE.Group()
	hull.add(wings,cylinder, windows)
	scene.add(hull);
	[cone, cylinder].forEach((item)=> item.applyMatrix4(new THREE.Matrix4().makeTranslation(0,15,0)))


	shipGroup.add( cone, hull );
	scene.add(shipGroup, sphere)


let axesHelper,gridHelper,lightHelper
//helpers
function addHelpers() {
	gridHelper = new THREE.GridHelper(200,50)
	axesHelper = new THREE.AxesHelper( 100 );
	lightHelper = new THREE.PointLightHelper(pointlight)
	// const ambient = new THREE.AmbientLight('skyblue')
	scene.add( axesHelper,gridHelper,lightHelper );
}
// addHelpers()
function removeHelpers() {
	scene.remove( axesHelper,gridHelper,lightHelper );
}


// This defines the initial distance of the camera
function init_cam(renderer,scene,camera){
const cameraTranslate = new THREE.Matrix4();
// const {x,y,z} ={x: 204.3181817338782, y: 95.30262676454568, z: 45.121987400043196}
const {x,y,z} = {x: 83.644823004712, y: 94.53865066260205, z: 192.17307542315658}

cameraTranslate.makeTranslation(x,y,z);
camera.applyMatrix4(cameraTranslate)

renderer.render( scene, camera );
}
init_cam(renderer,scene,camera)


const controls = new OrbitControls( camera, renderer.domElement );
let isOrbitEnabled = true;
const toggle = (e) => {
	if (e.key == "o"){
		isOrbitEnabled = !isOrbitEnabled;
	}
	// else if (e.key == "c"){
	// 	console.log("camera position",{...camera.position})
	// 	console.log("ship position", shipGroup.getWorldPosition())
	// 	console.log("sphere position", sphere.getWorldPosition())
	// 	console.log("ship scale", shipGroup.getWorldScale())
	// 	console.log("sphere scale", sphere.getWorldScale())
	// }
	else if (e.key == "w"){
		const setWireFrame = (obj) => {
			if (obj.material) obj.material.wireframe = !obj.material.wireframe
			if (!obj.children) return
			obj.children.forEach((child) =>{
				setWireFrame(child)			
			})
		}
		setWireFrame(scene)
	}
	else if (e.key == "1"){
		ROTATE_X = !ROTATE_X;
		updateCoords()
	}
	else if (e.key == "2"){
		ROTATE_Z = !ROTATE_Z;
		updateCoords()
	}
	else if (e.key=="h"){
		HELPERS ? removeHelpers():addHelpers() 
		HELPERS = !HELPERS
	}
	else if (e.key=="s"){
		SHOW_STARS ? scene.remove(stars):scene.add(stars)
		SHOW_STARS = !SHOW_STARS
	}
}
document.addEventListener('keydown',toggle)
//controls.update() must be called after any manual changes to the camera's transform
controls.update();

const stars = new THREE.Group()
function addStar(){
	const geometry = new THREE.SphereGeometry( 0.2, 22, 22 );
	const material = new THREE.MeshBasicMaterial( { color: 0xffffff} );
	const sphere = new THREE.Mesh( geometry, material );
	const [x,y,z] = Array(3).fill().map(()=>THREE.MathUtils.randFloatSpread(300))
	sphere.applyMatrix4(new THREE.Matrix4().makeTranslation(x,y,z))
	stars.add( sphere );
}
Array(300).fill().forEach(addStar)
scene.add(stars)



console.log("scene" , scene)
console.log("ship centre", shipGroup.getWorldPosition())

let sphereX, sphereY, sphereZ, shipX, shipY, shipZ, spherePos, shipPos
function updateCoords() {
	spherePos = sphere.getWorldPosition()
	sphereX = spherePos.x
	sphereY = spherePos.y
	sphereZ = spherePos.z
	shipPos = shipGroup.getWorldPosition()
	shipX = shipPos.x
	shipY = shipPos.y
	shipZ = shipPos.z
}
updateCoords()


console.log("posSHIP", shipX,shipY,shipZ)
console.log("posSPHERE", sphereX,sphereY,sphereZ)

shipGroup.applyMatrix4(new THREE.Matrix4().makeTranslation(-shipX,-shipY,-shipZ))
shipGroup.applyMatrix4(new THREE.Matrix4().makeRotationX(degrees_to_radians(90)))
shipGroup.applyMatrix4(new THREE.Matrix4().makeTranslation(shipX,shipY,shipZ))
shipGroup.applyMatrix4(new THREE.Matrix4().makeTranslation(-10,sphereY-shipX,sphereZ-shipZ))



function animate() {
	
	requestAnimationFrame( animate );

	controls.enabled = isOrbitEnabled;
	controls.update();


	shipGroup.applyMatrix4(new THREE.Matrix4().makeTranslation(-sphereX,-sphereY,-sphereZ))
	if (ROTATE_X) shipGroup.applyMatrix4(new THREE.Matrix4().makeRotationY(degrees_to_radians(0.8)))
	if (ROTATE_Z) shipGroup.applyMatrix4(new THREE.Matrix4().makeRotationZ(degrees_to_radians(0.8)))
	shipGroup.applyMatrix4(new THREE.Matrix4().makeTranslation(sphereX,sphereY,sphereZ))

	
	renderer.render( scene, camera );

}
animate()