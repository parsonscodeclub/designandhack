((function($){
//canvas stuff
 des_c = document.querySelector('.pattern-design-container-1'),
    des_ctx = des_c.getContext('2d'),
    dscw = des_c.offsetWidth, dsch = des_c.offsetHeight;
 dev_c = document.querySelector('.pattern-development-container-1'),
    dev_ctx = dev_c.getContext('2d'),
    dvcw = dev_c.offsetWidth, dvch = dev_c.offsetHeight;

function initSizes() {
  des_c.width = dev_c.width = window.innerWidth;
  des_c.height = des_c.offsetHeight;
  dev_c.height = dev_c.offsetHeight;
}
initSizes();

//$(window).on('resize', initSizes);

des_array = [];
dev_array = [];

var Shape = function(x, y) {
  this.x = x;
  this.y = y;

  var minr = 0, maxr = 100;
  this.r = minr + (Math.random() * (maxr - minr));
  if(this.r < 70) {
    this.r = 5 + (Math.random() * (10 - 5));
  } else {
    this.r = 80 + (Math.random() * (100 - 80));
  }

  //for lines
  var liner = this.r + 70;
  this.xp = (this.x - liner) + (Math.random() * ((this.x + liner) - (this.x - liner)));
  this.yp = Math.sqrt(liner*liner - Math.pow((this.xp - this.x), 2)) + this.y;

  if(!x && !y) {
    this.x = (Math.random() * dscw);
    this.y = (Math.random() * dvch);
  }

  this.filled = Math.random() > 0.5 ? true : false;
  //this.filled = true;
  var mins = 0.1, maxs = 1.2; //pixels per frame
  this.speedX = mins + (Math.random() * (maxs - mins));
  this.speedY = mins + (Math.random() * (maxs - mins));
}

Shape.prototype.drawCircle = function(color, ctx) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 8;
  ctx.moveTo(this.x, this.y);
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
  ctx.closePath();
  ctx.fill();
}

Shape.prototype.drawLine = function(color, ctx) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 20;
  ctx.beginPath();
  ctx.moveTo(this.x, this.y);
  ctx.lineTo(this.xp, this.yp);
  ctx.closePath();
  ctx.stroke();
}

Shape.prototype.drawHexagon = function(color, ctx) {
  var r = this.r;
  var k = Math.sqrt( (r*r) - Math.pow((r/2), 2) );
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 8;
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.beginPath();
  ctx.moveTo(0, r);
  ctx.lineTo(k, r/2);
  ctx.lineTo(k, -r/2);
  ctx.lineTo(0, -r);
  ctx.lineTo(-k, -r/2);
  ctx.lineTo(-k, r/2);
  ctx.lineTo(0, r);
  ctx.closePath();
  ctx.restore();
  if(this.filled) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
}

Shape.prototype.isOffscreen = function(maxx) {
  var buffer = 100;
  return this.x - this.r - buffer > maxx
    || this.y + this.r + buffer < 0
}

function init() {
  for(var i = 0; i < 40; i++) {
    des_array.push(new Shape());
  }
  for(var i = 0; i < 40; i++) {
    dev_array.push(new Shape());
  }
}

function update() {
  var items_deleted_des = 0;
  var items_deleted_dev = 0;

  //design
  for(var i = des_array.length - 1; i >= 0; i--) {
    des_array[i].x += des_array[i].speedX;
    des_array[i].y -= des_array[i].speedY;
    des_array[i].xp += des_array[i].speedX;
    des_array[i].yp -= des_array[i].speedY;
    if(des_array[i].isOffscreen(dscw)) {
      des_array.splice(i, 1);
      items_deleted_des++;
    }
  }
  for(var i = 0; i < items_deleted_des; i++) {
    var ns = new Shape(Math.random() * dscw, dsch + 100);
    des_array.push(ns);
  }

  //development
  for(var i = dev_array.length - 1; i >= 0; i--) {
    dev_array[i].x += dev_array[i].speedX;
    dev_array[i].y -= dev_array[i].speedY;
    dev_array[i].xp += dev_array[i].speedX;
    dev_array[i].yp -= dev_array[i].speedY;
    if(dev_array[i].isOffscreen(dvcw)) {
      dev_array.splice(i, 1);
      items_deleted_dev++;
    }
  }
  for(var i = 0; i < items_deleted_dev; i++) {
    var ns = new Shape(Math.random() * dvcw, dvch + 100);
    dev_array.push(ns);
  }
}

function draw() {
  for(s in des_array) {
    if(des_array[s].filled)
      des_array[s].drawCircle('#58dce4', des_ctx);
    else
      des_array[s].drawLine('#58dce4', des_ctx);
  }
  for(s in dev_array) {
    if(dev_array[s].filled)
      dev_array[s].drawCircle('#ff791d', dev_ctx);
    else
      dev_array[s].drawLine('#ff791d', dev_ctx);
  }
}

function animate() {
  des_ctx.clearRect(0,0,dscw,dsch);
  dev_ctx.clearRect(0,0,dvcw,dvch);
  update();
  draw();
  requestAnimationFrame(animate);
}

init();
animate();

})())