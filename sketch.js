let capture;
let lexicon;
let lines, data1, data2, corpora, markov;
let spacePressed = false;
let containsTarget = false;
let seedText;
let emotion;

//speech stuff
let myRec = new p5.SpeechRec("en-US", parseResult); // new P5.SpeechRec object
var mostrecentword = "";
myRec.continuous = true; // do continuous recognition
myRec.interimResults = true; // allow partial recognition (faster, less accurate)

function preload() {
  /* load the text
    one = loadStrings('corpora1.txt');
    two = loadStrings('corpora2.txt');
    three = loadStrings('corpora3.txt');
    four = loadStrings('corpora4.txt');
    five = loadStrings('corpora5.txt');
    six = loadStrings('corpora6.txt');
    seven = loadStrings('corpora7.txt');
    eight = loadStrings('corpora8.txt');
    */

    happy = loadStrings('happy.txt');
    lonley = loadStrings('lonely.txt');
    angry = loadStrings('anger.txt');
    loving = loadStrings('love.txt');
    sad = loadStrings('sad.txt');
    /*six = loadStrings('corpora6.txt');
    seven = loadStrings('corpora7.txt');
    eight = loadStrings('corpora8.txt');*/

    let markov = new RiMarkov(2);
  }

function setup() {
  createCanvas(windowWidth, windowHeight-(windowHeight*0.05));
  capture = createCapture(VIDEO);
  capture.size(width, height);
  capture.hide();

  noStroke();
  fill(255);
  textFont('times', 36);
  textAlign(CENTER, CENTER);
  
  disableInputChecks: true;

  /*
  markov.addText(one.join(' '));
  markov.addText(two.join(' '));
  markov.addText(three.join(' '));
  markov.addText(four.join(' '));
  markov.addText(five.join(' '));
  markov.addText(six.join(' '));
  markov.addText(seven.join(' '));
  markov.addText(eight.join(' '));
  */

  lines = ["freeforms"];
  emotion = "1. hold the spacebar \n 2. speak an emotion \n 3. generate a poem";
  drawText();
//  myRec.start(); // start engine
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

  let croppedVideo = capture.get(cropX, cropY, cropSize, capture.height*0.8);

  push();
  image(croppedVideo, width/2, 0, width/2, height);
  filter(THRESHOLD);
  pop();

  stroke(0);
  fill(255);
  strokeWeight(10);
  text(emotion, width - (width/2.5), height/4, 400, 400);
}

function drawText() {
  background(0);
  // this creates a block of text, lookig for a ' ' in the text as a point to join 
  // items togetehr into a unified string
  //text(lines.join(' '), width/10, height/4, 400, 400);
  text(lines, width/10, height/4, 400, 400);
}

/*
function keyPressed(){
  if (keyCode == 32) {
    lines = markov.generate(2);
    drawText();
  }
}
*/

function parseResult() {
  // recognition system will often append words into phrases.
  // so hack here is to only use the last word:
  mostrecentword = myRec.resultString.split(' ').pop();
  console.log(mostrecentword);
}

window.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    event.preventDefault(); // Prevents adding a newline in the div
    //inputDiv.innerHTML = "";
  }
});

// This function is called when any key is pressed
function keyPressed() {
  if (key === ' ') { // Check if the spacebar is pressed
    spacePressed = true;
    console.log("Spacebar is pressed");
    event.preventDefault(); // Prevents adding a newline in the div
    myRec.start(); // start engine
    emotion = '';
  }
}

// This function is called when any key is released
function keyReleased() {
  if (key === ' ') { // Check if the spacebar is released
    spacePressed = false;
    console.log("Spacebar is released");
    myRec.stop(); // start engine

    markov = new RiMarkov(2);
    console.log(markov);

    if (mostrecentword == "happy" || mostrecentword == 'happiness' || mostrecentword == 'joy') {
      emotion = 'happy';
    } else if (mostrecentword == 'sad' || mostrecentword == 'upset' || mostrecentword == 'low' || mostrecentword == 'bad') {
      emotion = 'sad';
    } else if (mostrecentword == 'angry' || mostrecentword == 'mad' || mostrecentword == 'furious') {
      emotion = 'angry';
    }


    if (emotion == 'sad') {
      markov.loadText(sad.join(' '));
    } else if (emotion == 'angry') {
      markov.loadText(angry.join(' '));
    } else {
      markov.loadText(happy.join(' '));
    }
    
    console.log(emotion);
    
    lines = markov.generateSentences(2);
    /*
    while(mostrecentword!= "") {
      
      for (let i = 0; i < lines.length; i++) {
        const words = lines[i].split(" ");
        for (let j = 0; i < words.length; i++) {
          console.log(words[j] + ": " + mostrecentword);
          if (RiTa.isNoun(words[j]) && RiTa.isNoun(mostrecentword)) {
            words[j] = mostrecentword;
          }

          if (RiTa.isAdverb(words[j]) && RiTa.isAdverb(mostrecentword)) {
            words[j] = mostrecentword;
          }

          if (RiTa.isAdjective(words[j]) && RiTa.isAdjective(mostrecentword)) {
            words[j] = mostrecentword;
          }

          if (RiTa.isVerb(words[j]) && RiTa.isVerb(mostrecentword)) {
            words[j] = mostrecentword;
          }
        }
      }
    }

    seedText = mostrecentword;
    */
    //lines = markov.generate(2);
    drawText();

    console.log(lines);
    console.log(mostrecentword);
  }
}