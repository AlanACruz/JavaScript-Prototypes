window.onload = function() {
  
  document.getElementById("start1").addEventListener("click", 
                                                      function() { 
                                                        Phys.init(); 
                                                     });
  document.getElementById("start2").addEventListener("click", 
                                                      function() { 
                                                        Phys.init2(); 
                                                     });
  Phys.init();
  setInterval( Phys.loop, Phys.ui.refreshRate() );
};

Phys = {};

Phys.numberOfObjs = 50;
Phys.speedLimit = 20;

Phys.init = function() {
  
  for ( i = 0; i < Phys.numberOfObjs;  i++) {
    Phys.particleArray[ i ] = new Phys.Particle();
  }
};

Phys.init2 = function() {
  
  var canvas = document.getElementById( "myCanvas" );
  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;
  
  Phys.particleArray[ 0 ] = new Phys.Particle( centerX, centerY, 25, 0, 0, true );
  for ( i = 1; i < Phys.numberOfObjs;  i++) {
    Phys.particleArray[ i ] = new Phys.Particle();
  }
};


Phys.particleArray = [];

Phys.ui = {
  "FPS": 30,
  "refreshRate": function() {
    // 1000 ms = 1 s.  This returns the number of ms per frame.
    return 1000 / Phys.ui.FPS;
  },
  "drawText": function( p1, p2 ) {
    var canvas = document.getElementById( "myCanvas" );
    var context = canvas.getContext( "2d" );
    
    context.font = "12px Courier";
    context.fillStyle = "White";
    context.fillText( "Fun-mode: True", 20, 20); 
  },
  "drawObj":  function( p ) {
    var canvas = document.getElementById( "myCanvas" );
    var context = canvas.getContext( "2d" );
    
    var centerX = p.x;
    var centerY = p.y;
    var radius = p.radius;
    
    context.beginPath();
    context.arc( centerX, centerY, radius, 0, 2 * Math.PI, false );
    context.fillStyle = "White";
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = "White";
    context.stroke();
  }
};

Phys.loop = function() {
  var canvas = document.getElementById( "myCanvas" );
  var context = canvas.getContext( "2d" );
  context.fillStyle = "Black";
  context.fillRect( 0, 0, canvas.width, canvas.height );

  // Perform Collision Detection 
  for ( i = 0; i < Phys.particleArray.length;  i++ ) {
    for ( j = 0; j < Phys.particleArray.length; j++ ) {
      if ( i !== j ){
        if ( Phys.particleArray[ i ].collisionDetection( Phys.particleArray[ j ] ) ){
          
          //Transfer Energy from Collision
          Phys.particleArray[ i ].collisionEngeryTransfer( Phys.particleArray[ j ] );
          Phys.particleArray[ j ].collisionEngeryTransfer( Phys.particleArray[ i ] );
            
          //Prevent Clipping
          Phys.particleArray[ i ].collisionCorrection( Phys.particleArray[ j ] );
        }
      }
    }
  }

  
  // Apply Forces
  for ( i = 0; i < Phys.particleArray.length;  i++ ) {
    for ( j = 0; j < Phys.particleArray.length; j++ ) {
      if ( i !== j ){
        Phys.particleArray[ i ].findVector( Phys.particleArray[j] );
      }
    }
  }
  
  // Peform Move
  for ( i = 0; i < Phys.particleArray.length;  i++ ) {
    Phys.particleArray[ i ].limitVector();
    Phys.particleArray[ i ].move();
    
  }
  
  // Draw Objects
  for ( i = 0; i < Phys.particleArray.length;  i++ ) {
    Phys.ui.drawObj( Phys.particleArray[ i ] );
  }
};

Phys.Particle = function( xCord, yCord, radiusSize, vecX, vecY, staticObj ) {
  var canvas = document.getElementById( "myCanvas" );
  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;
  this.x = xCord || Math.floor( Math.random() * centerX ) + ( centerX / 2 );
  this.y = yCord || Math.floor( Math.random() * centerY ) + ( centerY / 2 );
  this.radius = radiusSize || Math.floor( ( Math.random() * 10 ) + 1 );
  this.mass = Math.pow( Math.PI * this.radius, 2 );
  if ( vecX === 0 ) {
    this.vectorX = 0.0;
  } else {
    this.vectorX = Math.floor( ( Math.random() * Phys.speedLimit ) - Phys.speedLimit / 2 );
  }
  //console.log( "Initial X Vector: " + this.vectorX + "; vecX: " + vecX );
  if ( vecY === 0 ) {
    this.vectorY = 0.0;
  } else {
    this.vectorY = Math.floor( ( Math.random() * Phys.speedLimit ) - Phys.speedLimit / 2 );
  }
  //console.log( "Initial Y Vector: " + this.vectorY + "; vecY: " + vecY );
  this.staticObject = staticObj;
};

Phys.Particle.prototype = {
  "distanceToPoint": function( x, y ) {
    //sqrt( (x2-X1)^2 + (Y2-Y1)^2 )
    var distance = Math.sqrt( Math.pow( x - this.x, 2 ) + Math.pow( y - this.y, 2 ) );
    //console.log( "Distance: " + distance );
    return distance;
  },
  "collisionCorrection": function( p2 ){
    if ( this.staticObject !== true ) {
      var collisionX = p2.x - this.x;
      var collisionY = p2.y - this.y;
      var collisionDistance = this.distanceToPoint( p2.x, p2.y );
      var minDistance = ( this.radius + p2.radius );
      var minSafeDistance = minDistance + Phys.speedLimit;
      
      if ( collisionDistance <= minDistance ) {

        //Resolve X & Y
        var radians = ( Math.atan2( ( this.y - p2.y ), ( this.x - p2.x ) ) );
        this.x = p2.x + ( minSafeDistance * Math.cos( radians ) );
        this.y = p2.y + ( minSafeDistance * Math.sin( radians ) );
      }
    }
  },
  "collisionDetection": function( p2 ){
    if ( this.staticObject !== true ) {
      var collisionX = p2.x - this.x;
      var collisionY = p2.y - this.y;
      var collisionDistance = this.distanceToPoint( p2.x, p2.y );
      var minDistance = ( this.radius + p2.radius );
      
      if ( collisionDistance <= minDistance ) {
        return true;
      }
    }
    
    return false;
  },
  "collisionEngeryTransfer": function( p2 ){
    if ( this.staticObject !== true ) {
      var collisionX = p2.x - this.x;
      var collisionY = p2.y - this.y;
      var collisionDistance = this.distanceToPoint( p2.x, p2.y );
      var minDistance = ( this.radius + p2.radius );
      
      if ( collisionDistance <= minDistance ) {
        var inelasticCoefficient = 0.5;
        var ratioOfCollidingMasses = p2.mass / this.mass; 
        
        // TODO: add delta in agles
        
        var transferedX = inelasticCoefficient * ratioOfCollidingMasses * p2.vectorX;
        var transferedY = inelasticCoefficient * ratioOfCollidingMasses * p2.vectorY;
          
        this.vectorX += transferedX;
        this.vectorY += transferedY;
      }
    }
  },
  "findVector": function( p2 ) {
    if ( this.staticObject !== true ) {
      var deltaX = p2.x - this.x;
      var deltaY = p2.y - this.y;
      var force = ( this.gravity( p2 ) / this.mass );
      var distance = this.distanceToPoint( p2.x, p2.y );
      var radiusSum = this.radius + p2.radius;
      
      if ( distance >= radiusSum ) {
        // deltaX / Distance = vectorX / force OR force ( deltaX / distance ) = vectorX
        this.vectorX += ( force * ( deltaX / distance ) );
        this.vectorY += ( force * ( deltaY / distance ) );
      }
    }
  },
  "gravity": function( p2 ) {
    // F = G( M1* M2 ) / r^2
    var gravity= ( this.mass * p2.mass ) / Math.pow( this.distanceToPoint( p2.x, p2.y ), 2 );  
    return gravity;
  },
  "limitVector": function() {
    var speedLimit = Phys.speedLimit;
    if ( -speedLimit > this.vectorX || this.vectorX > speedLimit || -speedLimit > this.vectorY || this.vectorY > speedLimit ) {
      var nextPositionX = this.x + this.vectorX;
      var nextPositionY = this.y + this.vectorY;
      var distance = this.distanceToPoint( nextPositionX, nextPositionY );
      var limitedX = this.vectorX * ( speedLimit / distance );
      var limitedY = this.vectorY * ( speedLimit / distance );
      this.vectorX = limitedX;
      this.vectorY = limitedY;
    }
  },
  "move": function(){
    this.x += this.vectorX;
    this.y += this.vectorY;
    this.xPortal();
    this.yPortal();
  },
  "xPortal": function(){
    if ( this.x <= 0 ) {
      this.x %= 1200;
      this.x += 1200;
    } else if ( this.x >= 1200 ) {
      this.x %= 1200;
    }
  },
  "yPortal": function(){
    if ( this.y <= 0 ) {
      this.y %= 800;
      this.y += 800;
    } else if ( this.y >= 800 ) {
      this.y %= 800;
    }
  }
};
