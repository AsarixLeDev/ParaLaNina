class Particle {
    constructor() {
      //this.xNoise = new NoiseLoop(0.1, -width, width * 2);
      //this.yNoise = new NoiseLoop(0.1, -height, height * 2);
      this.x = random(0, width);
      this.y = random(0, height);
      this.dirNoise = new NoiseLoop(0.1, 0, 360);
      this.dNoise = new NoiseLoop(0.5, 10, 120);
      this.rNoise = new NoiseLoop(1, 240, 255);
      this.bNoise = new NoiseLoop(1, 150, 200);
      this.orange = true;
      this.a = 0;
    }
  
    render(a) {
        this.a = a;
        noStroke();
        let dirAngle = radians(this.dirNoise.value(a));
        let dir = p5.Vector.fromAngle(dirAngle);

        //console.log(`Angle: ${degrees(dirAngle)}, Vector: (${dir.x}, ${dir.y})`);
        let dx = mouseX - this.x;
        let dy = mouseY - this.y;
        let factor = getPointFactor3(this.x, this.y, 50);
        //console.log(factor);
        //factor = 0;
        this.x += dir.x + 0.1*factor*dx;
        this.y += dir.y + 0.1*factor*dy;
        
        let d = this.dNoise.value(a);
        let r = this.rNoise.value(a);
        let b = this.bNoise.value(a);
        fill(r, b, 100, 200);
    
        // Check if the ellipse is going off the screen and wrap it around
        if (this.x - d / 2 < 0) {
            this.drawParticle(this.x + width, this.y, d);
        } else if (this.x + d / 2 > width) {
            this.drawParticle(this.x - width, this.y, d);
        }
    
        if (this.y - d / 2 < 0) {
            this.drawParticle(this.x, this.y + height, d);
        } else if (this.y + d / 2 > height) {
            this.drawParticle(this.x, this.y - height, d);
        }
    
        // Draw the main ellipse
        this.drawParticle(this.x, this.y, d);
    
        // Wrap the coordinates if the center goes off the screen
        if (this.x < 0) {
            this.x = width;
        } else if (this.x > width) {
            this.x = 0;
        }
    
        if (this.y < 0) {
            this.y = height;
        } else if (this.y > height) {
            this.y = 0;
        }
    }

    drawParticle(x, y, size) {
        if (this.orange) {
            this.drawOrange(x, y, size);
        }
    }
    

    drawOrange(x, y, size) {
        let r = this.rNoise.value(this.a);
        let b = this.bNoise.value(this.a);
        fill(r, b, 100, 200);
        ellipse(x, y, size, size); // Draw the orange as a circle
    }
  }