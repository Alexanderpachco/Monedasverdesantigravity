let particles = [];
const PARTICLE_COUNT = 50;
const CONNECTION_DISTANCE = 150;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('left', '0');

    // Initialize particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }
}

function draw() {
    clear(); // Transparent background

    // Update and display particles
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].display();
        particles[i].checkEdges();

        // Connect particles
        for (let j = i + 1; j < particles.length; j++) {
            let d = dist(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
            if (d < CONNECTION_DISTANCE) {
                stroke(46, 204, 113, map(d, 0, CONNECTION_DISTANCE, 100, 0)); // Green with fading opacity
                strokeWeight(1);
                line(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
            }
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

class Particle {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.vel = createVector(random(-0.5, 0.5), random(-0.5, 0.5));
        this.size = random(3, 6);
    }

    update() {
        this.pos.add(this.vel);

        // Mouse interaction
        let mouse = createVector(mouseX, mouseY);
        let d = dist(this.pos.x, this.pos.y, mouse.x, mouse.y);
        if (d < 100) {
            let force = p5.Vector.sub(this.pos, mouse);
            force.setMag(0.5); // Repulsion strength
            this.pos.add(force);
        }
    }

    checkEdges() {
        if (this.pos.x > width) this.pos.x = 0;
        if (this.pos.x < 0) this.pos.x = width;
        if (this.pos.y > height) this.pos.y = 0;
        if (this.pos.y < 0) this.pos.y = height;
    }

    display() {
        noStroke();
        fill(46, 204, 113, 150); // Green color
        ellipse(this.pos.x, this.pos.y, this.size);
    }
}
