let vertices = [];
let initVertices = [];

function setup() {
    // Create a fullscreen canvas
    createCanvas(windowWidth, windowHeight);
    let r = height / 50;
    let precision = 1000;
    let index = 0;
    while (index < precision) {
        let t = TWO_PI * index / precision;
        let x = r * 16 * pow(sin(t), 3);
        let y = 13 * cos(t) - 5 * cos(2*t) - 2 * cos(3*t) - cos(4 * t);
        y *= -r;
        vertices.push({
            x: x,
            y: y
        });
        index += 1;
    }
    for (i = 0; i < vertices.length; i++) {
        initVertices[i] = {
            x: vertices[i].x,
            y: vertices[i].y
        };
    }
}

function draw() {
    // Set the background color
    background(255);

    // Calculate the center of the canvas
    let centerX = width / 2;
    let centerY = height / 2;

    // Translate to the center of the canvas
    translate(centerX, centerY);

    for (let i = 0; i < vertices.length; i++) {
        let initX = initVertices[i].x;
        let initY = initVertices[i].y;
        let dx = initX - vertices[i].x;
        let dy = initY - vertices[i].y;
        let dist = sqrt(dx * dx + dy * dy);
    
        let steepness = 0.05;
        let midpoint = sqrt(windowHeight * windowHeight + windowWidth * windowWidth) / 4;
        let value = 1 - (1 / (1 + Math.exp(-steepness * (dist - midpoint))));
    
        vertices[i].x += 0.05 * value * dx;
        vertices[i].y += 0.05 * value * dy;
    }

    // Draw the heart shape
    noStroke();
    fill(255, 0, 0);
    beginShape();
    for (let v of vertices) {
        vertex(v.x, v.y);
    }
    endShape(CLOSE);
}

function mouseDragged() {
    let maxDistance = sqrt(windowHeight * windowHeight + windowWidth * windowWidth) / 4;
    for (let v of vertices) {
        // Calculate the distance between the mouse and the vertex
        let distX = mouseX - (v.x + width / 2);
        let distY = mouseY - (v.y + height / 2);
        let distance = sqrt(distX * distX + distY * distY);

        // Calculate the attenuation factor
        let attenuationFactor = -log(0.02) / maxDistance;
        let value = 0.9 * exp(-attenuationFactor * distance);
        
        // Calculate the change in mouse position
        let dx = mouseX - pmouseX;
        let dy = mouseY - pmouseY;
        
        // Apply the attenuation factor to the vertices
        v.x += value * dx;
        v.y += value * dy;
    }
}


// This function is called whenever the window is resized
function windowResized() {
    // Resize the canvas to the new window dimensions
    resizeCanvas(windowWidth, windowHeight);
}
