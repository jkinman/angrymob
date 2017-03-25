/* globals THREE, $, TweenLite, Power3, TimelineMax  */
import React from 'react';
import {TweenLite, Power3, TimelineMax} from "gsap";
import * as THREE from 'three';
// import DATGUI from 'dat-gui';
import DATGUI from 'dat-gui';
require('../../styles/BackgroundScene.scss');

let camera, scene, renderer;
let plane;
let raycaster = new THREE.Raycaster();
let normalizedMouse = {
	x: 0,
	y: -180
};

// let lightBlue = {
// 	r: 34,
// 	g: 183,
// 	b: 236
// };

let darkBlue = {
	r: 0,
	g: 52,
	b: 74
};

let green = {
	r: 30,
	g: 180,
	b: 30
};

// let baseColorRGB = green;
let baseColorRGB = darkBlue;
let baseColor = "rgb(" + baseColorRGB.r + "," + baseColorRGB.g + "," + baseColorRGB.b + ")";
let nearStars, farStars, farthestStars;

let timer = 0;
let introContainer, skyContainer, xMark;
let scrollTimerID;

let gui = new DATGUI.GUI();

const vertexVariance = 4;

class BackgroundScene extends React.Component {

constructor( props, context ) {
	super( props, context );

}

componentDidMount() {
	this.init();

	window.addEventListener( 'scroll', (event) => {
		// clearTimeout( scrollTimerID );
		// scrollTimerID = setTimeout( () => {
			let percent = window.pageYOffset / document.body.clientHeight;
			this.shiftCamera( percent );
		// }, 10 );
	});

	window.addEventListener("resize", this.resize);

	window.addEventListener("mousemove", function(event) {

		// Normalize mouse coordinates
		normalizedMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		normalizedMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	});

	introContainer = $('.intro-container');
	skyContainer = $('.sky-container');
	xMark = $('.x-mark');

	this.renderLoop();

	// config dat gui
	gui.add( camera.position, 'x', -400, 400 );
	 gui.add( camera.position, 'y', -400, 400 );
	 gui.add( camera.position, 'z', -400, 400 );
	 gui.add( camera, 'fov', 1, 200 )
	 .onFinishChange( ( val ) => {
	  	this.resize();
	  });

}


resize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
}

init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
	renderer = new THREE.WebGLRenderer();
	// Scene initialization
	camera.position.z = 50;
	this.cameraStartPos = camera.position;

	renderer.setClearColor( "#121212", 1.0);
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setPixelRatio( window.devicePixelRatio );

	document.getElementById( 'backgroundscene' ).appendChild( renderer.domElement );

	// Lights
	let topLight = new THREE.DirectionalLight(0xffffff, 1);
	topLight.position.set(0,1,1).normalize();
	scene.add(topLight);

	let bottomLight = new THREE.DirectionalLight(0xffffff, 0.4);
	bottomLight.position.set(1,-1,1).normalize();
	scene.add(bottomLight);

	let skyLightRight = new THREE.DirectionalLight(0x666666, 0.2);
	skyLightRight.position.set(-1,-1,0.2).normalize();
	scene.add(skyLightRight);

	let skyLightCenter = new THREE.DirectionalLight(0x666666, 0.2);
	skyLightCenter.position.set(-0,-1,0.2).normalize();
	scene.add(skyLightCenter);

	let skyLightLeft = new THREE.DirectionalLight(0x666666, 0.2);
	skyLightLeft.position.set(1,-1,0.2).normalize();
	scene.add(skyLightLeft);

	// Mesh creation
	let geometry = new THREE.PlaneGeometry(400, 400, 70, 70);
	let darkBlueMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading, side: THREE.DoubleSide, vertexColors: THREE.FaceColors} );

	geometry.vertices.forEach(function(vertice) {
		vertice.x += (Math.random() - vertexVariance / (vertexVariance / 2)) * vertexVariance;
		vertice.y += (Math.random() - vertexVariance / (vertexVariance / 2)) * vertexVariance;
		vertice.z += (Math.random() - vertexVariance / (vertexVariance / 2)) * vertexVariance;
		vertice.dx = Math.random() - 0.5;
		vertice.dy = Math.random() - 0.5;
		vertice.randomDelay = Math.random() * 5;
	});

	for ( var i = 0; i < geometry.faces.length; i ++ ) {
	    geometry.faces[ i ].color.setStyle( baseColor );
		geometry.faces[ i ].baseColor =  baseColorRGB;
	}


	plane = new THREE.Mesh( geometry, darkBlueMaterial );
	scene.add( plane );

	// Create stars
	farthestStars = this.createStars(1200, 420, "#0952BD");
	farStars = this.createStars(1200, 370, "#A5BFF0");
	nearStars = this.createStars(1200, 290,"#118CD6");

	scene.add(farthestStars);
	scene.add(farStars);
	scene.add(nearStars);

	farStars.rotation.x = 0.25;
	nearStars.rotation.x = 0.25;

	// Uncomment for testing second camera position
	// camera.rotation.x = Math.PI / 2;
	// camera.position.y = -0;
	// camera.position.z = 20;
	// plane.scale.x = 0.4;
	this.planeOriginalScale = plane.scale;

}


createStars(amount, yDistance, color = "0x000000") {
	let opacity = Math.random();
	let starGeometry = new THREE.Geometry();
	let starMaterial = new THREE.PointsMaterial({color: color, opacity: opacity});

	for (let i = 0; i < amount; i++) {
		let vertex = new THREE.Vector3();
        vertex.z = (Math.random() - 0.5) * 1500;
        vertex.y = yDistance;
        vertex.x = (Math.random() - 0.5) * 1500;

        starGeometry.vertices.push(vertex);
	}
    return new THREE.Points(starGeometry, starMaterial);
}


renderLoop() {
	requestAnimationFrame( this.renderLoop.bind( this ));

	timer += 0.01;
	let vertices = plane.geometry.vertices;

	for (let i = 0; i < vertices.length; i++) {
		// Ease back to original vertice position while still maintaining sine wave
		vertices[i].x -= (Math.sin(timer + vertices[i].randomDelay) / 30) * vertices[i].dx;
		vertices[i].y += (Math.sin(timer + vertices[i].randomDelay) / 30) * vertices[i].dy;
		// ((vertices[i].x - vertices[i].originalPosition.x) * 0.1) +
	}
	//
	// // Determine where ray is being projected from camera view
	// raycaster.setFromCamera(normalizedMouse, camera);
	//
	// // Send objects being intersected into a variable
	// let intersects = raycaster.intersectObjects([plane]);
	//
	// if (intersects.length > 0) {
	//
	// 		let faceBaseColor = intersects[0].face.baseColor;
	//
	// 		plane.geometry.faces.forEach(function(face) {
	// 			face.color.r *= 255;
	// 			face.color.g *= 255;
	// 			face.color.b *= 255;
	//
	// 			face.color.r += (faceBaseColor.r - face.color.r) * 0.01;
	// 			face.color.g += (faceBaseColor.g - face.color.g) * 0.01;
	// 			face.color.b += (faceBaseColor.b - face.color.b) * 0.01;
	//
	// 			let rInt = Math.floor(face.color.r);
	// 			let gInt = Math.floor(face.color.g);
	// 			let bInt = Math.floor(face.color.b);
	//
	// 			let newBasecol = "rgb(" + rInt + "," + gInt + "," + bInt + ")";
	// 			face.color.setStyle(newBasecol);
	// 		});
	// 		plane.geometry.colorsNeedUpdate = true;
	//
	// 		intersects[0].face.color.setStyle("#006ea0");
	// 		plane.geometry.colorsNeedUpdate = true;
	// }
	plane.geometry.verticesNeedUpdate = true;
	plane.geometry.elementsNeedUpdate = true;

	farthestStars.rotation.y -= 0.00001;
	farStars.rotation.y -= 0.00005;
	nearStars.rotation.y -= 0.00011;

	renderer.render(scene, camera);
}

shiftCamera( percent = 1 ) {
	// console.log( percent );
	// if( this.introTimeline && this.introTimeline.hasOwnProperty( 'kill' )){
	// 	this.introTimeline.kill();
	// }

	// orig camera pos
	// 0, 0, z = 50
	let newCameraPos = {
		x: camera.position.x,
		y: 120 * percent,
		z: ((20 - this.cameraStartPos.z) * percent) + this.cameraStartPos.z
	}

	let newPlaneScalex = ((2 - this.planeOriginalScale.x) * percent) + this.planeOriginalScale.x;

	camera.position.set( camera.position.x, newCameraPos.y, newCameraPos.z );
	camera.rotation.x = (Math.PI / 2) * percent;
	introContainer.opacity = 0;
	// this.introTimeline = new TimelineMax();
	// this.introTimeline.add([
	// 	TweenLite.fromTo(introContainer, 0.5, {opacity: 1}, {opacity: 0, ease: Power3.easeIn}),
	// 	TweenLite.to(camera.rotation, 0.5, {x: newCameraPos.x , ease: Power3.easeInOut}),
	// 	TweenLite.to(camera.position, 0.5, {z: newCameraPos.z, ease: Power3.easeInOut}),
	// 	TweenLite.to(camera.position, 0.5, {y: newCameraPos.y, ease: Power3.easeInOut}),
	// 	// TweenLite.to(plane.scale, 0.5 , {x: newPlaneScalex, ease: Power3.easeInOut}),
	// ]);

	// this.introTimeline.add([
	// 	TweenLite.to(xMark, 0.5, {opacity: 1, ease: Power3.easeInOut}),
	// 	TweenLite.to(skyContainer, 0.5, {opacity: 1, ease: Power3.easeInOut})
	// ]);
}


xmark() {
	let outroTimeline = new TimelineMax();

	outroTimeline.add([
		TweenLite.to(xMark, 0.5, {opacity: 0, ease: Power3.easeInOut}),
		TweenLite.to(skyContainer, 0.5, {opacity: 0, ease: Power3.easeInOut}),
		TweenLite.to(camera.rotation, 3, {x: 0, ease: Power3.easeInOut}),
		TweenLite.to(camera.position, 3, {z: 50, ease: Power3.easeInOut}),
		TweenLite.to(camera.position, 2.5, {y: 0, ease: Power3.easeInOut}),
		TweenLite.to(plane.scale, 3, {x: 1, ease: Power3.easeInOut}),
	]);

	outroTimeline.add([
		TweenLite.to(introContainer, 0.5, {opacity: 1, ease: Power3.easeIn}),
	]);
}

render() {

	return(
		<div>
			<div className="intro-container"></div>
			<div className="sky-container"></div>
			<div className="x-mark"></div>
			<div id="backgroundscene"></div>
		</div>
	);
}

}

export default BackgroundScene;
