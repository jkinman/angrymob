'use strict';

import React from 'react';
import * as THREE from 'three';
import Beacon from './Beacon'
import TCL from 'three-collada-loader';
import BaseSceneComponent from './BaseSceneComponent';

let TWEEN = require('tween.js');
require('styles/Globe3d.sass');

const CAMERA_ANIMATION_DELAY = 3000;
const CAMERA_ROTATE_TIME = 3000;
const TEXTURE_SIZE = 512;
// const PRIMARY = 0x666666;
const PRIMARY = 0x53BDFD;
const GREEN = 0x1ec503;
const BACKGROUND_MESH = false;


class Globe3dComponent extends BaseSceneComponent {

  constructor(props, context) {
    super(props, context);
    window.addEventListener( 'resize', this.resize.bind( this ), false);
    if( this.datgui ){
      this.datgui = this.props.datgui.addFolder( 'globe' );
    }
    this.visionPresets = {
      spriteDepthCheck: false,
      cameraRotation: new THREE.Euler(),
      cameraLookAt: new THREE.Vector3( 0, -10, 0 ),
      cameraPosition: new THREE.Vector3(0, -150, 160)
    };
    this.start = Date.now();

  }

  componentDidMount(){
    super.componentDidMount();
    document.getElementById( 'globe3d-component' ).appendChild( this.renderer.domElement );

    this.buildScene();
    this.loadGlobe( true );
    // this.initPostprocessing();
    // this.buildTestGeo();
    // this.loadTestScene();

    // requestAnimationFrame( this.renderLoop.bind( this ));
    this.mounted = true;
    this.startAmbientAnimation();
    this.cameraLookAtVector = this.scene.position;

  }


  renderLoop( time ) {
    if( !this.mounted ) return;
    super.renderLoop( time );
    // requestAnimationFrame( this.renderLoop.bind( this ) );
    TWEEN.update();

  }

  buildScene(){
    super.buildScene();
    // setup camera rig with attached DirectionalLight
    this.cameraPiviot = new THREE.Object3D();
    this.scene.add( this.cameraPiviot );
    //add main camera
    this.cameraPiviot.add( this.camera );
    // add attatched flashlight
    this.dlight = new THREE.DirectionalLight( new THREE.Color('rgb(255, 255, 255)'), 0.3 );
    this.dlight.position.set(-100, 100, 90);
    this.cameraPiviot.add( this.dlight );
    if( this.datgui ){
      this.datgui.add( this.camera.position, 'x', -200, 200 );
      this.datgui.add( this.camera.position, 'y', -200, 200 );
      this.datgui.add( this.camera.position, 'z', -200, 200 );
      this.datgui.add( this.camera, 'fov', 1, 100 )
      .onFinishChange( ( val ) => {
        this.resize();
        });
    }
    // this.addSkySphere( this.scene );
    // this.addSkyBox( this.scene );

    // do other shapes
    if( BACKGROUND_MESH ){
      let continentMaterial = new THREE.MeshBasicMaterial({
        wireframe: true,
        color: 0x000000,
        side: THREE.DoubleSide,
        // shading: THREE.FlatShading,
        wireframeLinewidth: 0.3,
        transparent: true,
        opacity: 0.2
      });

      let secondGlobe = new THREE.IcosahedronGeometry( 300, 2);
      let secondGlobeMesh = new THREE.Mesh(secondGlobe, continentMaterial);
      this.scene.add( secondGlobeMesh );
    }

    // world objects group
    this.worldgroup = new THREE.Object3D();
    this.scene.add( this.worldgroup );

    let globeGeo = new THREE.SphereGeometry( 63.5, 20, 20 )
    let globeMaterial = new THREE.MeshPhongMaterial( {
      color: PRIMARY,
      wireframe: false,
      visible: true,
      fog: false
    });

    this.globe = new THREE.Mesh( globeGeo, globeMaterial );
    this.worldgroup.add( this.globe );

    this.continents = new THREE.Object3D();
    this.globalEvents = new THREE.Object3D();
    this.dots = new THREE.Points();

    this.worldgroup.add( this.continents );
    this.worldgroup.add( this.globalEvents );
    this.worldgroup.add( this.dots );

    this.ambientLight = new THREE.AmbientLight( new THREE.Color('rgb(255, 255, 255)'), 0.1 );
    this.scene.add( this.ambientLight );

  }

  addGalaxyShader( scene ) {
    let uniforms = {

    };

    let material = new THREE.ShaderMaterial( {
      uniforms:       uniforms,
      vertexShader:   document.getElementById('sky-vertex').textContent,
      fragmentShader: document.getElementById('sky-fragment').textContent
    });

  }

  addSkyBox( masterScene ) {

    let root = '../../../images/mp_crimmind/';
    let loader = new THREE.CubeTextureLoader();
    loader.setPath( root );
    let sides = [
      // 'App-logo.png',
      // 'App-logo.png',
      // 'App-logo.png',
      // 'App-logo.png',
      // 'App-logo.png',
      // 'App-logo.png',
      `criminalmind_bk.tga`,
      `criminalmind_dn.tga`,
      `criminalmind_ft.tga`,
      `criminalmind_lf.tga`,
      `criminalmind_rt.tga`,
      `criminalmind_up.tga`,
    ]

    let textureCube = loader.load( sides );
    let geometry = new THREE.BoxGeometry(10000, 10000, 10000);
    let material = new THREE.MeshBasicMaterial({
        envMap: textureCube,
        side: THREE.BackSide,
        color: 0xffffff,
        transparent: true,
        opacity: 0.75
    });
    let mesh = new THREE.Mesh(geometry, material);
    masterScene.add( mesh );

  }

  addSkySphere( masterScene ) {

    let texture = THREE.ImageUtils.loadTexture('../../images/futuristic-tech-wallpaper-high-quality-resolution-PowOf2.png');

    let uniforms = {
      texture: { type: 't', value: texture }
    };

    let material = new THREE.ShaderMaterial( {
      uniforms:       uniforms,
      vertexShader:   document.getElementById('sky-vertex').textContent,
      fragmentShader: document.getElementById('sky-fragment').textContent
    });

    var geometry = new THREE.SphereGeometry(3000, 100, 60 );

    let skyBox = new THREE.Mesh(geometry, material);
    skyBox.scale.set(-1, 1, 1);
    skyBox.eulerOrder = 'XZY';
    skyBox.renderDepth = 1000.0;
    masterScene.add( skyBox );

  }

  fakeCoords() {
    // this makes a random coordinate in northamerica
    return( [
      20 + ( 40 * Math.random()),
      (68 + ( 70 * Math.random())) * -1
    ]);
  }

  dropMarker( marker ) {
    if( ! this.markers){
      this.markers = [marker];
    }
    if(! marker.coordinates ){
      marker.coordinates = this.fakeCoords();
    }

  }

  showGlobalEvent(event = {}) {
    this.clearDeadGlobalGeo();
    // extract a latlong from the Tweet object
    let latlong = false;
    let position = false;
    let flagpolePosition = false;
    let height = 64.5;

    if(! event.coordinates ){
      event.coordinates = this.fakeCoords();
    }
    let beacon = new Beacon( event, 64.5, this.shaderRenderer.texture, 3000 );
    beacon.children.map( (e) => {
      e.lookAt( this.globe.position );
    });

    this.animateCamera( beacon.getPosition(), () =>{
      this.globalEvents.add( beacon );
      beacon.activate()
    } );

  }
  addBeacon( position, flagpolePosition, event) {
  }

  animateCamera( vector, cb ){
    this.ambientAnimationOn = false;
      // this.zoomCameraInOut();
      let from = new THREE.Vector3( 0,0,1 );
      let quiternion = new THREE.Quaternion().setFromUnitVectors( from, vector.clone().normalize());
      let finalRotation = new THREE.Euler()
      finalRotation.setFromQuaternion( quiternion );

      let i = 0;

      let anim = new TWEEN.Tween( i )
      .to( 1, CAMERA_ROTATE_TIME)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate( ( percent ) => {
        this.cameraPiviot.quaternion.slerp( quiternion, percent/100 );
      })
      .onComplete( () => {
        if( cb ){
          cb.call( this );
        }
      })
      .start();
  }

  startAmbientAnimation() {
    this.ambientAnimationOn = true;
    requestAnimationFrame( this.doAmbientAnim.bind( this ) );
  }

  doAmbientAnim() {
    this.cameraPiviot.rotation.x += 0.0009;
    this.cameraPiviot.rotation.y += 0.0005;
    if( this.ambientAnimationOn ){
      requestAnimationFrame( this.doAmbientAnim.bind( this ) );
    }
  }

  loadGlobe( useIcosahedronGeometry=false ) {
    this.loader = new TCL();

    this.loader.options = {
      centerGeometry: false,
      defaultEnvMap: false,
      convertUpAxis: false
    };

    let globe_thin_lines = require( '../../blender/globe_thin_lines.dae' );
    this.loader.load(
      globe_thin_lines,
      ( obj ) => {
        let continents = [];
        //////////////////////////////////////////////
        // build point cloud
        let geometry = new THREE.Geometry();
        if( useIcosahedronGeometry ){
          let tempGeo = new THREE.IcosahedronGeometry( 63.5, 4 );
          tempGeo.vertices.forEach( (vert, i) => {
            geometry.vertices.push(vert);
          });
        }
        else{
          obj.scene.children[0].children[0].geometry.vertices.forEach( (vert, i) => {
            geometry.vertices.push(vert);
          });
        }

        material = new THREE.PointsMaterial( {
          size: 0.2,
          sizeAttenuation: true,
          color: PRIMARY,
          side: THREE.SingleSide,
        }
        );

        this.dots.geometry = geometry;
        this.dots.material = material;
        //////////////////////////////////////////////
        // build point cloud for stars
        let starGeo = new THREE.Geometry();
        let tempGeo = new THREE.IcosahedronGeometry( 5000, 5 );
          tempGeo.vertices.forEach( (vert, i) => {
            if( Math.random() < 0.2 ) {
              starGeo.vertices.push(vert);
            }
          });
          let starMat = new THREE.PointsMaterial( {
            size: 5,
            // transparent: false,
            // opacity:0.7,
            color: 0xffffff,
            side: THREE.DoubleSide,
          });

        let stars = new THREE.Points();
        stars.geometry = starGeo;
        stars.material = starMat;
        // this.worldgroup.add( stars );

        //////////////////////////////////////////////
        // rebuild continents
        let continentMaterial = new THREE.MeshBasicMaterial({
          wireframe: true,
          color: PRIMARY,
          side: THREE.DoubleSide,
          // shading: THREE.FlatShading,
          wireframeLinewidth: 1
        });

        obj.scene.children[0].children.forEach( (object) => {
          if( object.name.indexOf( 'group' ) > -1){
            continents.push( object );
            object.children[0].material = continentMaterial;
          }
        });

        continents.forEach( (obj) => {
          // debugger;
          this.continents.add( obj );
        })

        let geo, material, mesh;
        if( obj instanceof THREE.Geometry ){
          geo = obj;
          this.globe.geometry = geo;
        }

        //////////////////////////////////////////////
        // tweak starting position
        let X = (-95 * Math.PI)/180;
        let Y = (5 * Math.PI)/180;
        let Z = (30 * Math.PI)/180;

        this.continents.rotateX( X );
        this.continents.rotateY( Y );
        this.continents.rotateZ( Z );
        this.dots.rotateX( X );
        this.dots.rotateY( Y );
        this.dots.rotateZ( Z );

      },
      ( xhr ) => {
        //loading CB
      },
      ( err ) => {
        // error CB
      }
    );
  }

  clearDeadGlobalGeo( all=false ) {
    for (var i = this.globalEvents.children.length -1; i >= 0; i--) {
      if( all || !this.globalEvents.children[i].alive ){
        this.globalEvents.remove( this.globalEvents.children[i] );
      }
    }
  }

  moveCameraRig( position, time = CAMERA_ANIMATION_DELAY, cb ) {
    new TWEEN.Tween( this.cameraPiviot.position )
    .to( position, time)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onComplete( () =>{
      if( cb ){
        cb.call( this );
      }
    })
    .start();

  }

  zoomCameraInOut() {
    let positionOut = new THREE.Vector3(this.restPos.x, this.restPos.y, this.restPos.z * 1.10);
    let positionIn = new THREE.Vector3(this.restPos.x, this.restPos.y, this.restPos.z);

    let zoomIn = new TWEEN.Tween( this.camera.position )
    .to( positionIn, CAMERA_ROTATE_TIME * 0.5)
    .easing(TWEEN.Easing.Quadratic.InOut);

    let zoomOut = new TWEEN.Tween( this.camera.position )
    .to( positionOut, CAMERA_ROTATE_TIME * 0.5)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .chain( zoomIn )
    .start();

  }

    hide( cb ) {
      this.animateLookAt( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3(0, 100, 0 ));

      let fromVector = this.camera.position;
      if( this.globeTween && this.globeTween.to() != this.globeTween.valueOf()){
        fromVector = this.globeTween.valueOf();
        this.globeTween.stop();
      }

      let position = new THREE.Vector3(0, 100, -50);

      this.globeTween = new TWEEN.Tween( fromVector )
      .to( position, CAMERA_ANIMATION_DELAY)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onComplete( () =>{
        if( cb ){
          cb.call( this );
        }
      })
      .start();

    }

      moveToBottom( cb ) {

        this.animateLookAt( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3(0, 140, 0 ));

        let fromVector = this.camera.position;
        if( this.globeTween && this.globeTween.to() != this.globeTween.valueOf()){
          fromVector = this.globeTween.valueOf();
          this.globeTween.stop();
        }

        let position = new THREE.Vector3(0, 10, 90);

        this.globeTween = new TWEEN.Tween( fromVector )
        .to( position, CAMERA_ANIMATION_DELAY)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onComplete( () =>{
          if( cb ){
            cb.call( this );
          }
        })
        .start();

      }

  moveToMiddle( cb, paramPos ) {
    this.animateLookAt( new THREE.Vector3(0, 100, 0 ), new THREE.Vector3(0, 0, 0 ));

    let position = new THREE.Vector3(50, -10, 190);
    if( this.globeTween && this.globeTween.to() != this.globeTween.valueOf()){
      position = this.globeTween.valueOf();
      this.globeTween.stop();
    }
    else if( paramPos ){
      position = paramPos;
    }
    this.restPos = position;

    this.globeTween = new TWEEN.Tween( this.camera.position )
    .to( position, CAMERA_ANIMATION_DELAY)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onComplete( () =>{
      if( cb ){
        cb.call( this );
      }
    })
    .start();
  }

  animateLookAt( from, to ) {
    let cameraLookAt = this.cameraLookAtVector;

    if( this.globeLookAtTween && this.globeLookAtTween.to() != this.globeLookAtTween.valueOf()){
      cameraLookAt = this.globeLookAtTween.valueOf();
      this.globeLookAtTween.stop();
    }

    this.globeLookAtTween = new TWEEN.Tween( cameraLookAt )
    .to( to, CAMERA_ANIMATION_DELAY )
    .onUpdate( (p) => {
      this.camera.lookAt( cameraLookAt );
      this.cameraLookAtVector = cameraLookAt;
    })
    .onComplete( () => {
      this.camera.lookAt( to );
      this.cameraLookAtVector = to;
    })
    .start();
  }


  render() {
    return (
      <div className="globe3d-component" id="globe3d-component">
      </div>
    );
  }
}

Globe3dComponent.displayName = 'SharedGlobeGlobe3dComponent';

export default Globe3dComponent;
// let event = {
// coordinates: [23.498582, -109.987843] //cabo
// coordinates: [-54.557950,-69.733685] // bottom of south america
//   coordinates: [49.282729,-123.120738]// vancouer
// };
