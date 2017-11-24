'use strict';

import * as THREE from 'three';
import React from 'react';
import TCL from 'three-collada-loader';
import BaseSceneComponent from './BaseSceneComponent';

let TWEEN = require('tween.js');
require('styles/Globe3d.sass');

require( "imports-loader?THREE=THREE!../assets/three.js/examples/js/postprocessing/EffectComposer.js");
require( "imports-loader?THREE=THREE!../assets/three.js/examples/js/postprocessing/RenderPass.js");
require( "imports-loader?THREE=THREE!../assets/three.js/examples/js/postprocessing/ShaderPass.js");
require( "imports-loader?THREE=THREE!../assets/three.js/examples/js/postprocessing/MaskPass.js");
require( "imports-loader?THREE=THREE!../assets/three.js/examples/js/postprocessing/SSAOPass.js");

require( "imports-loader?THREE=THREE!../assets/three.js/examples/js/shaders/DotScreenShader.js");
require( "imports-loader?THREE=THREE!../assets/three.js/examples/js/shaders/CopyShader.js");
require( "imports-loader?THREE=THREE!../assets/three.js/examples/js/shaders/RGBShiftShader.js");
require( "imports-loader?THREE=THREE!../assets/three.js/examples/js/shaders/SSAOShader.js");


import SimplexNoise from "imports-loader?THREE=THREE!../assets/threex/SimplexNoise.js";
// window.SimplexNoise = SimplexNoise;
import * as THREEx from "imports-loader?THREE=THREE!../assets/threex/threex.terrain.js";


const CAMERA_ANIMATION_DELAY = 3000;
const CAMERA_ROTATE_TIME = 3000;
const TEXTURE_SIZE = 512;
const PRIMARY = 0x666666;
// const PRIMARY = 0x53BDFD;
const GREEN = 0x1ec503;
const BACKGROUND_MESH = false;
let onRenderFcts= [];

class ProceduralLandscapeComponent extends BaseSceneComponent {
  constructor(props, context) {
    super(props, context);
    window.addEventListener( 'resize', this.resize.bind( this ), false);
    if( this.datgui ){
      this.datgui = this.props.datgui.addFolder( 'landscape' );
    }
    this.start = Date.now();

  }

  componentDidMount(){
    super.componentDidMount();
    document.getElementById( 'proceduralLandscape-component' ).appendChild( this.renderer.domElement );

    this.buildScene();
    this.mounted = true;

  }

  renderLoop( time ) {
    if( !this.mounted ) return;
    super.renderLoop( time );
    TWEEN.update();
  }

  buildScene(){
    super.buildScene();
    
    // this.scene.add( this.camera );
    this.camera.position.x = 20;
    this.camera.position.y = 20;
    this.camera.position.z = 20;
    if( this.datgui ){
      this.datgui.add( this.camera.position, 'x', -200, 200 );
      this.datgui.add( this.camera.position, 'y', -200, 200 );
      this.datgui.add( this.camera.position, 'z', -200, 200 );
      this.datgui.add( this.camera, 'fov', 1, 100 )
      .onFinishChange( ( val ) => {
        this.resize();
        });
    }

    this.ambientLight = new THREE.AmbientLight( new THREE.Color('rgb(255, 255, 255)'), 0.1 );
    this.scene.add( this.ambientLight );
    
    this.scene.fog = new THREE.Fog(0x000, 0, 45);
     // ;(function(){
      var light	= new THREE.AmbientLight( 0x202020 )
      this.scene.add( light )
      var light	= new THREE.DirectionalLight('white', 5)
      light.position.set(0.5, 0.0, 2)
      this.scene.add( light )
      var light	= new THREE.DirectionalLight('white', 0.75*2)
      light.position.set(-0.5, -0.5, -2)
      this.scene.add( light )		
    // })()

    var heightMap	= THREEx.Terrain.allocateHeightMap(256,256)
    THREEx.Terrain.simplexHeightMap(heightMap)	
    var geometry	= THREEx.Terrain.heightMapToPlaneGeometry(heightMap)
    THREEx.Terrain.heightMapToVertexColor(heightMap, geometry)
  /* Wireframe built-in color is white, no need to change that */
    var material	= new THREE.MeshBasicMaterial({
      wireframe: true
    });
    var mesh	= new THREE.Mesh( geometry, material );
    this.scene.add( mesh );
    mesh.lookAt(new THREE.Vector3(0,1,0));
  /* Play around with the scaling */
    mesh.scale.y	= 3.5;
    mesh.scale.x	= 3;
    mesh.scale.z	= 0.20;
    mesh.scale.multiplyScalar(10);
  /* Play around with the camera */
    onRenderFcts.push(function(delta, now){
      mesh.rotation.z += 0.2 * delta;	
    })
    onRenderFcts.push(function(){
      this.renderer.render( scene, camera );		
    })
    var lastTimeMsec= null
  



    this.camera.position.set( 0, 0, 0 );
    this.camera.lookAt( mesh.position );

  }

  render() {
    return (
      <div className="proceduralLandscape-component" id="proceduralLandscape-component">
      </div>
    );
  }
}

ProceduralLandscapeComponent.displayName = 'ProceduralLandscapeComponent';

export default ProceduralLandscapeComponent;
