
import React from 'react';
import Data from './NeuralNet/Data';
import Connection from './NeuralNet/Connection';


class NeuralNetComponent extends React.Component {


  constructor(props, context) {
    super(props, context);


    this.opts = {
      range: 180,
      baseConnections: 3,
      addedConnections: 5,
      baseSize: 5,
      minSize: 1,
      dataToConnectionSize: .4,
      sizeMultiplier: .7,
      allowedDist: 40,
      baseDist: 40,
      addedDist: 30,
      connectionAttempts: 100,

      dataToConnections: 1,
      baseSpeed: .04,
      addedSpeed: .05,
      baseGlowSpeed: .4,
      addedGlowSpeed: .4,

      rotVelX: .003,
      rotVelY: .002,

      repaintColor: '#111',
      connectionColor: 'hsla(200,60%,light%,alp)',
      rootColor: 'hsla(0,60%,light%,alp)',
      endColor: 'hsla(160,20%,light%,alp)',
      dataColor: 'hsla(40,80%,light%,alp)',

      wireframeWidth: .1,
      wireframeColor: '#88f',

      depth: 250,
      focalLength: 250,
    };

    this.squareRange = this.opts.range * this.opts.range;
    this.squareAllowed = this.opts.allowedDist * this.opts.allowedDist;
    this.mostDistant = this.opts.depth + this.opts.range;
    this.sinX = this.sinY = 0;
    this.cosX = this.cosY = 0;

    this.connections = [];
    this.toDevelop = [];
    this.data = [];
    this.all = [];
    this.tick = 0;
    this.totalProb = 0;

    this.animating = false;

    this.Tau = Math.PI * 2;
  }

  componentDidMount() {
    this.mounted = true;

    this.w = this.refs.neuralnet.width = window.innerWidth,
    this.h = this.refs.neuralnet.height = window.innerHeight,
    this.ctx = this.refs.neuralnet.getContext( '2d' ),

    this.opts.vanishPoint = {
            x: this.w / 2,
            y: this.h / 2
          }

    this.ctx.fillStyle = '#222';
    this.ctx.fillRect( 0, 0, this.w, this.h );
    this.ctx.fillStyle = '#ccc';
    this.ctx.font = '50px Verdana';
    this.ctx.fillText( 'Calculating Nodes', this.w / 2 - this.ctx.measureText( 'Calculating Nodes' ).width / 2, this.h / 2 - 15 );

    // window.setTimeout( this.init, 4 ); // to render the loading screen
    window.addEventListener( 'click', this.init );
    window.addEventListener( 'resize', () => {
      this.opts.vanishPoint.x = ( this.w = c.width = window.innerWidth ) / 2;
      this.opts.vanishPoint.y = ( this.h = c.height = window.innerHeight ) / 2;
      ctx.fillRect( 0, 0, this.w, this.h );
    });

    this.init();
  }

  init() {

    this.connections.length = 0;
    this.data.length = 0;
    this.all.length = 0;
    this.toDevelop.length = 0;

    let connection = new Connection( 0, 0, 0, this.opts, this.connections, this.all, this.toDevelop, this.ctx );
    // connection.step = Connection.rootStep;
    this.connections.push( connection );
    this.all.push( connection );
    connection.link();

    while( this.toDevelop.length > 0 ){

      this.toDevelop[ 0 ].link();
      this.toDevelop.shift();
    }

    if( !this.animating ){
      this.animating = true;
      this.anim();
    }
  }



  squareDist( a, b ){

    var x = b.x - a.x,
    y = b.y - a.y,
    z = b.z - a.z;

    return x*x + y*y + z*z;
  }
  anim(){

    window.requestAnimationFrame( this.anim );

    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.fillStyle = this.opts.repaintColor;
    this.ctx.fillRect( 0, 0, this.w, this.h );

    ++this.tick;

    let rotX = this.tick * this.opts.rotVelX;
    let rotY = this.tick * this.opts.rotVelY;

    this.cosX = Math.cos( rotX );
    this.sinX = Math.sin( rotX );
    this.cosY = Math.cos( rotY );
    this.sinY = Math.sin( rotY );

    if( this.data.length < this.connections.length * this.opts.dataToConnections ){
      var datum = new Data( this.connections[ 0 ], this.opts );
      this.data.push( datum );
      this.all.push( datum );
    }

    this.ctx.globalCompositeOperation = 'lighter';
    this.ctx.beginPath();
    this.ctx.lineWidth = this.opts.wireframeWidth;
    this.ctx.strokeStyle = this.opts.wireframeColor;
    this.all.map( ( item ) => {
      item.step();
    } );
    this.ctx.stroke();
    this.ctx.globalCompositeOperation = 'source-over';
    this.all.sort( ( a, b ) => {
      return b.screen.z - a.screen.z
    } );
    this.all.map( ( item ) => {
      item.draw();
    } );

    /*ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.arc( opts.vanishPoint.x, opts.vanishPoint.y, opts.range * opts.focalLength / opts.depth, 0, Tau );
    ctx.stroke();*/
  }


  render( ) {
    return(
      <div>
      <canvas id='neuralnet' ref='neuralnet'></canvas>
      </div>
    )
  }
}

NeuralNetComponent.defaultProps = {
};

export default NeuralNetComponent;
