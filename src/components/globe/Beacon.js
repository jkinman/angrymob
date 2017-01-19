'use strict';

import THREE from 'three';
let TWEEN = require('tween.js');

const TEXTURE_SIZE = 512;
const PRIMARY = 0x53BDFD;
const GREEN = 0x1ec503;
const CONTRAST = 0xFF6600;
const FADE_OUT_TIME = 1000;
const SHOCKWAVE_ANIM_TIME = 1500;

class Beacon extends THREE.Object3D{

	constructor( event, globeDiameter, map, lifeSpan=3000 ) {
		super();
		this.event = event;
		this.alive = false;
		this.beaconPosition = new THREE.Vector3();
		this.lifeSpan = event.lifeSpan;
		if( this.lifeSpan === undefined ){
			this.lifeSpan = lifeSpan;
		}
		this.globalGeoMarker = this.createMarker( event, globeDiameter, map, lifeSpan );
	}

	destructor() {

	}

	activate() {
		this.alive = true;
		this.fadeIn();
		this.kickoffFX();
		if( this.lifeSpan > 0 ){
			setTimeout( this.fadeOut.bind( this ), this.lifeSpan );
		}
		requestAnimationFrame( this.renderLoop.bind( this ));
	}

	renderLoop( t ) {
		TWEEN.update();
	}

	getPosition() {
		return this.beaconPosition;
	}

	kickoffFX() {
		if( this.shockwave ){

			this.shockwave.material.opacity = 1;
			let blastFade = new TWEEN.Tween( this.shockwave.material )
			.easing(TWEEN.Easing.Quadratic.Out)
			.to( {opacity: 0.0}, SHOCKWAVE_ANIM_TIME )
			.start();
			let size = 6;
			if( this.event.impact ){
				size = 12 * this.event.impact
			}
			let blastGrow = new TWEEN.Tween( this.shockwave.scale )
			.easing(TWEEN.Easing.Quadratic.Out)
			.to( {y: size, x: size, z: 1}, SHOCKWAVE_ANIM_TIME )
			.start();

		}
	}

	createMarker( event, globeDiameter, map, lifeSpan ) {
		this.beacon = undefined;
		this.shockwave = undefined;
		let position = this.latLonToVector3( event.coordinates[0], event.coordinates[1], globeDiameter );
		let flagpolePosition = this.latLonToVector3( event.coordinates[0], event.coordinates[1], globeDiameter + 1 );
		this.beaconPosition = position;
		if( event.shader ){
			this.beacon = this.makeShaderSprite( event.impact, map );
			this.beacon.position.x = position.x;
			this.beacon.position.y = position.y;
			this.beacon.position.z = position.z;
		}

		if( event.shockwave ){
			let geo = new THREE.CircleGeometry( 1, 32 );
			let material = new THREE.MeshLambertMaterial( {
				color: CONTRAST,
				side: THREE.BackSide,
		        transparent: true,
				opacity: 1.0,
				emissiveIntensity: 0.5,
				emissive: 0xFFFFFF,
			 } );
			this.shockwave = new THREE.Mesh( geo, material );

			this.shockwave.position.x = position.x;
			this.shockwave.position.y = position.y;
			this.shockwave.position.z = position.z;

			this.add( this.shockwave );
		}

		if( !event.title ){
			event.title = `${position.x}, ${position.y}`;
		}

		if( !event.subtitle ){
			event.subtitle = `$${2000 * Math.random()} | 6 mins ago`;
		}

		this.spritey = this.makeTextSprite( event ,{});

		if( event.coordinates ){
			this.spritey.position.x = flagpolePosition.x;
			this.spritey.position.y = flagpolePosition.y;
			this.spritey.position.z = flagpolePosition.z;

			this.add( this.spritey );
			if( this.beacon ){
				this.add( this.beacon );
			}
		}

		return( this );
	}

	makeShaderSprite( map, size = 0.5 ) {
		size = Math.max( size, 0.3 );
		size = Math.min( size, 1.0 );
		let scale = size * 100;

		let shaderSpriteMaterial = new THREE.SpriteMaterial(
			{
				map: map,
				color: 0xffffff,
				transparent: true,
				opacity: 0.9,
				depthWrite: false,
				depthTest: false,
				blending: THREE.AdditiveBlending,
				fog: true,
		} );

		let sprite = new THREE.Sprite( shaderSpriteMaterial );
		sprite.scale.set( scale, scale, 1.0);
		// let group = new THREE.Object3D();
		// group.add( sprite );
		// sprite.position.y += 30;
		// sprite.position.x += 10;
		// return group;
		return sprite;
	}

	makeTextSprite( message, parameters ) {
		this.OVERLAY_WIDTH = 128;
		this.OVERLAY_HEIGHT = 75;
		let LEFT_OFFSET = 256;
		let TOP_OFFSET = 256;
		if ( parameters === undefined ) parameters = {};

		let fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Open Sans";
		let fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 20;
		let borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 20;
		let borderColor = parameters.hasOwnProperty("borderColor") ? parameters["borderColor"] : { r:200, g:200, b:200, a:1.0 };
		let backgroundColor = parameters.hasOwnProperty("backgroundColor") ? parameters["backgroundColor"] : { r:200, g:200, b:200, a: 1.00 };
		let canvas = document.createElement('canvas');
		let context = canvas.getContext('2d');
		canvas.width = 512;
		canvas.height = 512;
		context.font = "Bold " + fontsize + "px " + fontface;
		if( message.image ){
			debugger;
			context.drawImage( message.image, 64, 64, 64, 64 );
		}
		if( message.imageUrl ){

			let img = new Image();
			img.crossOrigin = "anonymous";
			img.onload = () => {
				context.drawImage( img, LEFT_OFFSET - this.OVERLAY_HEIGHT, TOP_OFFSET - this.OVERLAY_HEIGHT, this.OVERLAY_HEIGHT, this.OVERLAY_HEIGHT );
				texture.needsUpdate = true;
				// finishSprite( canvas, context );
			};
			img.src = message.imageUrl;
		}

		// get size data (height depends only on font size)
		let metrics = context.measureText( message.title );
		let textWidth = metrics.width;
		// DRAW BLACK BACKGROUND
		context.fillStyle = 'rgb(0,0,0, 0.3)';
		context.lineWidth = borderThickness;
		context.fillRect( LEFT_OFFSET, TOP_OFFSET - this.OVERLAY_HEIGHT, 300, this.OVERLAY_HEIGHT );

		// FLAG POLE
		context.fillStyle = 'white';
		context.fillRect( LEFT_OFFSET, TOP_OFFSET - this.OVERLAY_HEIGHT, 4, this.OVERLAY_HEIGHT );
		// text color
		context.fillStyle = "rgba(68, 167, 242, 1.0 )";

		// TITLE
		let y = 30;
		context.fillText( message.title, borderThickness + LEFT_OFFSET, y + TOP_OFFSET - this.OVERLAY_HEIGHT);

		// SUBTITLE
		context.fillStyle = "rgba(255, 255, 255, 1.0 )";
		y += 25;
		fontsize = Math.round( fontsize * 0.75 );
		context.font = "Bold " + fontsize + "px " + fontface;

		context.fillText( message.subtitle, borderThickness + LEFT_OFFSET, y + TOP_OFFSET - this.OVERLAY_HEIGHT);

		// canvas contents will be used for a texture
		let texture = new THREE.Texture( canvas );
		texture.needsUpdate = true;
		// texture.anisotropy = 32;
		texture.generateMipmaps = false;
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;
		// texture.offset = new THREE.Vector2( 0, 0 );

		let spriteMaterial = new THREE.SpriteMaterial({
			map: texture,
			color: 0xffffff,
			transparent: true,
			opacity: 0.8,
			depthWrite: false,
			depthTest: false,
			blending: THREE.NormalBlending,
			fog: true,
		});
		var sprite = new THREE.Sprite( spriteMaterial );
		sprite.scale.set( 42, 42, 1.0);

		return sprite;
	}

	fadeIn() {
		let obj;
		this.children.map( ( e ) => {
	        if( e.material ){
	            obj = e.material;
				obj.transparent = true;
		        obj.opacity = 0;
		        let anim = new TWEEN.Tween( obj )
		        .easing(TWEEN.Easing.Quadratic.InOut)
		        .to( {opacity: 1}, FADE_OUT_TIME )
		        .start();
	        }
	        else if( e.materials ){
	          obj = e.materials[0];
			  obj.transparent = true;
	          obj.opacity = 0;
	          let anim = new TWEEN.Tween( obj )
	          .easing(TWEEN.Easing.Quadratic.InOut)
	          .to( {opacity: 1}, FADE_OUT_TIME )
	          .start();
	        }
		});

	}

	fadeOut() {
		let obj;
		this.children.map( ( e ) => {
	        if( e.material ){
	            obj = e.material;
				obj.transparent = true;
		        let anim = new TWEEN.Tween( obj )
		        .easing(TWEEN.Easing.Quadratic.InOut)
		        .to( {opacity: 0}, FADE_OUT_TIME )
				.onComplete( () => { this.alive = false;})
		        .start();
	        }
	        else if( e.materials ){
	          obj = e.materials[0];
			  obj.transparent = true;
	          let anim = new TWEEN.Tween( obj )
	          .easing(TWEEN.Easing.Quadratic.InOut)
	          .to( {opacity: 0}, FADE_OUT_TIME )
	  		.onComplete( () => { this.alive = false;})
	          .start();
	        }
		});

	}

	latLonToVector3 (lat, lon, height){
		const PI_HALF = Math.PI / 2;
		height = height ? height : 0;

		var vector3 = new THREE.Vector3(0, 0, 0);

		lon = lon + 10;
		lat = lat - 2;

		var phi = PI_HALF - lat * Math.PI / 180 - Math.PI * 0.01;
		var theta = 2 * Math.PI - lon * Math.PI / 180 + Math.PI * 0.06;
		var rad =  height;
		// var rad = 600 + height;

		vector3.x = Math.sin(phi) * Math.cos(theta) * rad;
		vector3.y = Math.cos(phi) * rad;
		vector3.z = Math.sin(phi) * Math.sin(theta) * rad;

		return vector3;
	}
}

export default Beacon;
