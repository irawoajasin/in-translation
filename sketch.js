let capture;
let lexicon;
let lines, markov, data

function preload() {
  // load the text
    data = loadStrings('parable.txt');
  }

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.size(width, height);
  capture.hide();

  noStroke();
  textFont('times', 24);
  textAlign(CENTER, CENTER);
  lines = ["black futurities"];
  markov = RiTa.markov(4);
  markov.addText(data.join(' '));
  drawText();
}

function draw() {
  /*
  if(frameCount % 60 == 0){
    background(255);
    text(RiTa.randomWord(), width/4, height/2);
  }
  */

  let cropSize = min(capture.width, capture.height);  // Get the smallest dimension
  let cropX = (capture.width - cropSize) / 2;
  let cropY = (capture.height - cropSize) / 2;

  let croppedVideo = capture.get(cropX, cropY, cropSize, cropSize);

  push();
  image(croppedVideo, width/2, 0, width/2, height);
  filter(THRESHOLD);
  pop();
}

function drawText() {
  background(250);
  // this creates a block of text, lookig for a ' ' in the text as a point to join 
  // items togetehr into a unified string
  text(lines.join(' '), width/10, height/4, 400, 400);
}

function keyPressed(){
  if (keyCode == 32) { // 32 is key code for spacebar
    lines = markov.generate(round(random(50, 250)));
    drawText();
  }
}
