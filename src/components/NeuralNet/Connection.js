class Connection{

  constructor ( x, y, z, opts, connections, all, toDevelop, ctx ){
    this.opts = opts;
    this.x = x;
    this.y = y;
    this.z = z;
    this.size = this.opts.baseSize;

    this.screen = {};

    this.links = [];
    this.probabilities = [];
    this.isEnd = false;

    this.glowSpeed = this.opts.baseGlowSpeed + this.opts.addedGlowSpeed * Math.random();
    this.Tau = Math.PI * 2;
    this.squareRange = this.opts.range * this.opts.range;
    this.squareAllowed = this.opts.allowedDist * this.opts.allowedDist;

    this.connections = connections;
    this.all = all;
    this.toDevelop = toDevelop;

    this.ctx = ctx;

    this.mostDistant = this.opts.depth + this.opts.range;

    this.sinX = this.sinY = 0;
    this.cosX = this.cosY = 0;
    this.tick = 0;

  }

  link() {

    if( this.size < this.opts.minSize )
    return this.isEnd = true;

    var links = [],
    connectionsNum = this.opts.baseConnections + Math.random() * this.opts.addedConnections |0,
    attempt = this.opts.connectionAttempts,

    alpha, beta, len,
    cosA, sinA, cosB, sinB,
    pos = {},
    passedExisting, passedBuffered;

    while( links.length < connectionsNum && --attempt > 0 ){

      alpha = Math.random() * Math.PI;
      beta = Math.random() * this.Tau;
      len = this.opts.baseDist + this.opts.addedDist * Math.random();

      cosA = Math.cos( alpha );
      sinA = Math.sin( alpha );
      cosB = Math.cos( beta );
      sinB = Math.sin( beta );

      pos.x = this.x + len * cosA * sinB;
      pos.y = this.y + len * sinA * sinB;
      pos.z = this.z + len *        cosB;

      if( pos.x*pos.x + pos.y*pos.y + pos.z*pos.z < this.squareRange ){

        passedExisting = true;
        passedBuffered = true;
        for( var i = 0; i < this.connections.length; ++i )
        if( this.squareDist( pos, this.connections[ i ] ) < this.squareAllowed )
        passedExisting = false;

        if( passedExisting )
        for( var i = 0; i < links.length; ++i )
        if( this.squareDist( pos, links[ i ] ) < this.squareAllowed )
        passedBuffered = false;

        if( passedExisting && passedBuffered )
        links.push( { x: pos.x, y: pos.y, z: pos.z } );

      }

    }

    if( links.length === 0 )
    this.isEnd = true;
    else {
      for( var i = 0; i < links.length; ++i ){

        var pos = links[ i ],
        connection = new Connection( pos.x, pos.y, pos.z, this.size * this.opts.sizeMultiplier );

        this.links[ i ] = connection;
        this.all.push( connection );
        this.connections.push( connection );
      }
      for( var i = 0; i < this.links.length; ++i )
      this.toDevelop.push( this.links[ i ] );
    }
  }

  step() {

    this.setScreen();
    this.screen.color = ( this.isEnd ? this.opts.endColor : this.opts.connectionColor ).replace( 'light', 30 + ( ( this.tick * this.glowSpeed ) % 30 ) ).replace( 'alp', .2 + ( 1 - this.screen.z / this.mostDistant ) * .8 );

    for( var i = 0; i < this.links.length; ++i ){
      this.ctx.moveTo( this.screen.x, this.screen.y );
      this.ctx.lineTo( this.links[ i ].screen.x, this.links[ i ].screen.y );
    }
  }

  rootStep (){
    this.setScreen();
    this.screen.color = this.opts.rootColor.replace( 'light', 30 + ( ( this.tick * this.glowSpeed ) % 30 ) ).replace( 'alp', ( 1 - this.screen.z / this.mostDistant ) * .8 );

    for( var i = 0; i < this.links.length; ++i ){
      ctx.moveTo( this.screen.x, this.screen.y );
      ctx.lineTo( this.links[ i ].screen.x, this.links[ i ].screen.y );
    }
  }

  draw() {
    ctx.fillStyle = this.screen.color;
    ctx.beginPath();
    ctx.arc( this.screen.x, this.screen.y, this.screen.scale * this.size, 0, this.Tau );
    ctx.fill();
  }

  squareDist( a, b ){

    var x = b.x - a.x,
    y = b.y - a.y,
    z = b.z - a.z;

    return x*x + y*y + z*z;
  }

  // setScreen = Data.prototype.setScreen = function(){
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

export default Connection;
