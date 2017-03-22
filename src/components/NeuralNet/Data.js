class Data{
  constructor ( connection, opts ){
    this.opts = opts;
    this.glowSpeed = this.opts.baseGlowSpeed + this.opts.addedGlowSpeed * Math.random();
    this.speed = this.opts.baseSpeed + this.opts.addedSpeed * Math.random();

    this.screen = {};

    this.setConnection( connection );
  }

  reset (){

    this.setConnection( connections[ 0 ] );
    this.ended = 2;
  }

  step (){

    this.proportion += this.speed;

    if( this.proportion < 1 ){
      this.x = this.ox + this.dx * this.proportion;
      this.y = this.oy + this.dy * this.proportion;
      this.z = this.oz + this.dz * this.proportion;
      this.size = ( this.os + this.ds * this.proportion ) * this.opts.dataToConnectionSize;
    } else
    this.setConnection( this.nextConnection );

    this.screen.lastX = this.screen.x;
    this.screen.lastY = this.screen.y;
    this.setScreen();
    this.screen.color = this.opts.dataColor.replace( 'light', 40 + ( ( tick * this.glowSpeed ) % 50 ) ).replace( 'alp', .2 + ( 1 - this.screen.z / mostDistant ) * .6 );

  }
  draw(){

    if( this.ended )
    return --this.ended; // not sre why the thing lasts 2 frames, but it does

    ctx.beginPath();
    ctx.strokeStyle = this.screen.color;
    ctx.lineWidth = this.size * this.screen.scale;
    ctx.moveTo( this.screen.lastX, this.screen.lastY );
    ctx.lineTo( this.screen.x, this.screen.y );
    ctx.stroke();
  }
  setConnection( connection ){

    if( connection.isEnd )
    this.reset();

    else {

      this.connection = connection;
      this.nextConnection = connection.links[ connection.links.length * Math.random() |0 ];

      this.ox = connection.x; // original coordinates
      this.oy = connection.y;
      this.oz = connection.z;
      this.os = connection.size; // base size

      this.nx = this.nextConnection.x; // new
      this.ny = this.nextConnection.y;
      this.nz = this.nextConnection.z;
      this.ns = this.nextConnection.size;

      this.dx = this.nx - this.ox; // delta
      this.dy = this.ny - this.oy;
      this.dz = this.nz - this.oz;
      this.ds = this.ns - this.os;

      this.proportion = 0;
    }
  }

  setScreen() {
    var x = this.x,
    y = this.y,
    z = this.z;

    // apply rotation on X axis
    var Y = y;
    y = y * this.cosX - z * this.sinX;
    z = z * this.cosX + Y * this.sinX;

    // rot on Y
    var Z = z;
    z = z * this.cosY - x * this.sinY;
    x = x * this.cosY + Z * this.sinY;

    this.screen.z = z;

    // translate on Z
    z += this.opts.depth;

    this.screen.scale = this.opts.focalLength / z;
    this.screen.x = this.opts.vanishPoint.x + x * this.screen.scale;
    this.screen.y = this.opts.vanishPoint.y + y * this.screen.scale;

  }

}
export default Data;
