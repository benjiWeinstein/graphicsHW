// import { BufferGeometry } from 'three';
import {OrbitControls} from './OrbitControls.js'

// init scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild( renderer.domElement );


function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

// Add here the rendering of your spaceship

	const pointlight = new THREE.PointLight(0xffffff, 1.2)
	pointlight.position.set(20, 20, 20)
	scene.add(pointlight)


	let geometry = new THREE.SphereGeometry( 5, 32, 16 );
	let material = new THREE.MeshPhongMaterial( { color: 0x54819c} );
	const sphere = new THREE.Mesh( geometry, material );
	sphere.name = 'Planet'
	sphere.applyMatrix4(new THREE.Matrix4().makeTranslation(20,10,20))


	const shipGroup = new THREE.Group()
	shipGroup.name = 'Ship'
	geometry = new THREE.ConeGeometry( 6, 20, 32 );
	material = new THREE.MeshPhongMaterial( {color: 0xffff00} );
	const cone = new THREE.Mesh( geometry, material );
	cone.name = "Ship head"
	cone.applyMatrix4(new THREE.Matrix4().makeTranslation(5,20,5))

	geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );
	material = new THREE.MeshPhongMaterial( {color: 0xffaf00} );
	const cylinder = new THREE.Mesh( geometry, material );
	cylinder.name = "Ship body"
	cylinder.applyMatrix4(new THREE.Matrix4().makeTranslation(5,0,5))


	function createTriangle(){
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

	const tri1 = createTriangle()
	tri1.applyMatrix4(new THREE.Matrix4().makeTranslation(-6,5,5))

	const tri2 = createTriangle()
	tri2.applyMatrix4(new THREE.Matrix4().makeRotationY(degrees_to_radians(180)))
	tri2.applyMatrix4(new THREE.Matrix4().makeTranslation(16,5,5))

	const tri3 = createTriangle()
	tri3.applyMatrix4(new THREE.Matrix4().makeRotationY(degrees_to_radians(90)))
	tri3.applyMatrix4(new THREE.Matrix4().makeTranslation(5,5,16))

	const tri4 = createTriangle()
	tri4.applyMatrix4(new THREE.Matrix4().makeRotationY(degrees_to_radians(270)))
	tri4.applyMatrix4(new THREE.Matrix4().makeTranslation(5,5,-6))

	const hull = new THREE.Group()
	hull.add(tri1,tri2,tri3,tri4,cylinder)
	scene.add(hull);
	[cone, cylinder].forEach((item)=> item.applyMatrix4(new THREE.Matrix4().makeTranslation(0,15,0)))


	shipGroup.add( cone, hull );
	shipGroup.applyMatrix4(new THREE.Matrix4().makeTranslation(5,5,5))
	scene.add(shipGroup, sphere)



//helpers
function addHelpers() {
	const gridHelper = new THREE.GridHelper(200,50)
	const axesHelper = new THREE.AxesHelper( 100 );
	const lightHelper = new THREE.PointLightHelper(pointlight)
	// const ambient = new THREE.AmbientLight('skyblue')
	scene.add( axesHelper,gridHelper,lightHelper );
}
addHelpers()



// This defines the initial distance of the camera
function init_cam(renderer,scene,camera){
const cameraTranslate = new THREE.Matrix4();
cameraTranslate.makeTranslation(2,13,45);
camera.applyMatrix4(cameraTranslate)

renderer.render( scene, camera );
}
init_cam(renderer,scene,camera)


const controls = new OrbitControls( camera, renderer.domElement );
let isOrbitEnabled = true;
const toggleOrbit = (e) => {
	if (e.key == "o"){
		isOrbitEnabled = !isOrbitEnabled;
	}
	else if (e.key == "c"){
		console.log("camera position",{...camera.position})

	}
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
}
document.addEventListener('keydown',toggleOrbit)
//controls.update() must be called after any manual changes to the camera's transform
controls.update();


function addStar(){
	const geometry = new THREE.SphereGeometry( 0.2, 22, 22 );
	const material = new THREE.MeshBasicMaterial( { color: 0xffffff} );
	const sphere = new THREE.Mesh( geometry, material );
	const [x,y,z] = Array(3).fill().map(()=>THREE.MathUtils.randFloatSpread(300))
	sphere.applyMatrix4(new THREE.Matrix4().makeTranslation(x,y,z))
	scene.add( sphere );
}
Array(300).fill().forEach(addStar)



console.log("scene" , scene)
console.log("ship position", shipGroup.getWorldPosition())


const {x,y,z} = sphere.getWorldPosition()
const {x2,y2,z2} = shipGroup.getWorldPosition()

// shipGroup.applyMatrix4(new THREE.Matrix4().makeTranslation(-x2,-y2,-z2))
// shipGroup.applyMatrix4(new THREE.Matrix4().makeRotationX(degrees_to_radians(270)))
// shipGroup.applyMatrix4(new THREE.Matrix4().makeTranslation(x2,y2,z2))


// shipGroup.applyMatrix4(new THREE.Matrix4().makeTranslation(-x,y,z))
// console.log("ship position", shipGroup.getWorldPosition())


function animate() {
	
	requestAnimationFrame( animate );

	controls.enabled = isOrbitEnabled;
	controls.update();

	// shipGroup.applyMatrix4(new THREE.Matrix4().makeTranslation(-x,-y,-z).makeRotationY(0.02).makeTranslation(x,y,z))

	// shipGroup.applyMatrix4(new THREE.Matrix4().makeTranslation(-x,-y,-z))
	// shipGroup.applyMatrix4(new THREE.Matrix4().makeRotationY(0.02))
	// shipGroup.applyMatrix4(new THREE.Matrix4().makeTranslation(x,y,z))


	// shipGroup.applyMatrix4(new THREE.Matrix4().makeRotationZ(0.01))
    // shipGroup.applyMatrix4(new THREE.Matrix4().makeRotationY(degrees_to_radians(3)))
	// shipGroup.rotateY(0.02)

	//cone.applyMatrix4(new THREE.Matrix4().makeRotationZ(0.01))


	renderer.render( scene, camera );

}
animate()