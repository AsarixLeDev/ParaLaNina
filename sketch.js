let vertices = [];
let initVertices = [];
let movedVerticesFactors = [];
let r;
let particles = new Array(50);
let offset = 0;
let castleImage;
let quoteImage;
let song;
let isDragging = false;
let romanticFont;

function getPointFactor3(x, y, sigma) {
    let distX = mouseX - x;
    let distY = mouseY - y;
    let distance = Math.sqrt(distX * distX + distY * distY);
    let value = Math.exp(-Math.pow(distance, 2) / (2 * Math.pow(sigma, 2)));
    return value;
}

function getVerticeFactor3(vertice) {
    return getPointFactor3(vertice.x + width / 2, vertice.y + height / 2, 100);
}

function getPointMovingValue(index) {
    if (movedVerticesFactors.length > 0) {
        return movedVerticesFactors[index];
    }
    return 0;
}

function preload() {
    castleImage = loadImage('assets/castle.png'); // Ensure the path is correct
    song = loadSound('assets/music.mp3'); // Ensure the path is correct
    romanticFont = loadFont('assets/font.otf');
}

function mousePressed() {
    isDragging = false; // Reset dragging state
    for (let i = 0; i < vertices.length; i++) {
        movedVerticesFactors[i] = getVerticeFactor3(vertices[i]);
    }
}

function mouseDragged() {
    isDragging = true; // Set dragging state
    for (let i = 0; i < vertices.length; i++) {
        let value = getPointMovingValue(i);
        let dx = mouseX - pmouseX;
        let dy = mouseY - pmouseY;
        vertices[i].x += value * dx;
        vertices[i].y += value * dy;
    }
}

function mouseReleased() {
    if (!isDragging) {
        // Mouse was pressed but not dragged
        if (song.isPlaying()) {
            song.stop();
        } else {
            song.play();
        }
        for (let i = 0; i < vertices.length; i++) {
            movedVerticesFactors[i] = getVerticeFactor3(vertices[i]);
        }
    }
    isDragging = false; // Reset dragging state
    movedVerticesFactors = [];
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    r = height / 50;
    let precision = 1000;
    let index = 0;
    while (index < precision) {
        let t = TWO_PI * index / precision;
        let x = r * 16 * pow(sin(t), 3);
        let y = 13 * cos(t) - 5 * cos(2*t) - 2 * cos(3*t) - cos(4 * t);
        y *= -r;
        vertices.push({ x: x, y: y });
        index += 1;
    }
    for (let i = 0; i < vertices.length; i++) {
        initVertices[i] = { x: vertices[i].x, y: vertices[i].y };
    }
    for (let i = 0; i < particles.length; i++) {
        particles[i] = new Particle();
    }
}

function draw() {
    background(255);
    if (castleImage) {
        imageMode(CORNER); // Set image mode to CORNER to draw from top-left corner
        let imgHeight = height * 2;
        let imgWidth = castleImage.width * (height / castleImage.height);
        image(castleImage, 0, - height / 4, imgWidth, imgHeight);
    }
    // Display the text in the specified rectangles
    let textMargin = height / 8;
    let textX = width * 0.68;
    let textY = height / 4; // Position for the main quote
    let authorY = height * 0.7; // Position for the author
    let textSizeValue = int(height / 12); // Adjust text size as needed
    let authorSizeValue = int(height / 25); // Adjust author text size as needed

    textFont(romanticFont);
    textSize(textSizeValue);
    fill(255, 0, 0);
    textAlign(RIGHT, TOP);
    text("L'homme est ainsi, il a deux faces : il ne peut pas aimer sans s'aimer.", textX, textY, int(width / 4), int(height * 0.8));

    textSize(authorSizeValue);
    textAlign(LEFT, BOTTOM);
    text("Albert Camus", textX, authorY, int(width / 4), 50);
    //if (quoteImage) {
    //    let margin = height / 8;
    //    let imgHeight = height / 6; // or any other desired size
    //    let imgWidth = quoteImage.width * (imgHeight / quoteImage.height);
    //    let imgX = width - imgWidth - margin;
    //    let imgY = height - imgHeight - margin - height / 4;
    //    let angle = -PI / 4; // Adjust this value to rotate the image to the desired angle

        // Save the current state of the canvas
    //    push();
    //    translate(imgX + imgWidth / 2, imgY + imgHeight / 2); // Translate to the image center
    //    rotate(angle); // Rotate the canvas
    //    imageMode(CENTER); // Draw the image from its center
    //    image(quoteImage, 0, 0, imgWidth, imgHeight);
        // Restore the original state
    //    pop();
    //}

    let a = radians(offset);
    offset += 1;
    if (offset >= 360) {
        offset = 0;
    }
    for (let p of particles) {
        p.render(a);
    }

    let centerX = width / 2;
    let centerY = height / 2;
    translate(centerX, centerY);

    for (let i = 0; i < vertices.length; i++) {
        let initX = initVertices[i].x;
        let initY = initVertices[i].y;
        let dx = initX - vertices[i].x;
        let dy = initY - vertices[i].y;
        let dist = sqrt(dx * dx + dy * dy);

        let steepness = 0.001;
        let midpoint = r;
        let value = 1 - (1 / (1 + Math.exp(-steepness * (dist - midpoint))));
        let factor = getPointMovingValue(i);
        value = max(0, 1 - value - factor);

        vertices[i].x += 0.05 * value * dx;
        vertices[i].y += 0.05 * value * dy;
    }

    let mult = 1 + sin(a) * 0.1;
    noStroke();
    fill(255, 0, 0);
    beginShape();
    for (let v of vertices) {
        let x = v.x * mult;
        let y = v.y * mult;
        vertex(x, y);
    }
    endShape(CLOSE);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
