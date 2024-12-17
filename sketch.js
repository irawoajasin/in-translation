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

  // load the text
    happy = loadStrings('happy.txt');
    anxiety = loadStrings('anxiety.txt');
    angry = loadStrings('anger.txt');
    sad = loadStrings('sad.txt');

    // create new markov chain that generates 2 sentences
    let markov = new RiMarkov(2);
  }

function setup() {
  //set up camera
  createCanvas(windowWidth, windowHeight-(windowHeight*0.05));
  capture = createCapture(VIDEO);
  capture.size(width, height);
  capture.hide();

  // text setup
  noStroke();
  fill(255);
  textFont('times', 36);
  textAlign(CENTER, CENTER);
  
  //helps ensure that output is novel text
  disableInputChecks: true;

  lines = ["freeforms"];
  emotion = "1. hold the spacebar \n 2. speak an emotion \n 3. generate a poem \n 4. click screen to save";
  drawText();
}

function draw() {

  //crop the camera feed to fit in half the screen
  let cropSize = min(capture.width, capture.height);  // Get the smallest dimension
  let cropX = (capture.width - cropSize) / 2;
  let cropY = (capture.height - cropSize) / 2;
  let croppedVideo = capture.get(cropX, cropY, cropSize, capture.height*0.8);

  // threshold filter on cam feed
  push();
  image(croppedVideo, width/2, 0, width/2, height);
  filter(THRESHOLD);
  pop();

  // label the emotion that the user states
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

function parseResult() {
  // recognition system will often append words into phrases.
  // so hack here is to only use the last word:
  mostrecentword = myRec.resultString.split(' ').pop();
  console.log(mostrecentword);
}

// This function is called when any key is pressed
function keyPressed() {
  if (key === ' ') { // Check if the spacebar is pressed
    spacePressed = true;
    console.log("Spacebar is pressed");
    event.preventDefault(); // Prevents adding a newline in the div
    myRec.start(); // start engine
    emotion = 'listening...';
  }
}

// This function is called when any key is released
function keyReleased() {
  if (key === ' ') { // Check if the spacebar is released
    spacePressed = false;
    console.log("Spacebar is released");
    myRec.stop(); // start engine

    //when space released, create a brand new 2 sentence markov chain to train
    markov = new RiMarkov(2);
    console.log(markov);

    // listens for the most recent word you said, looks for the top 5 synonyms of the target emotion we have represented
    if (mostrecentword == "happy" || mostrecentword == 'happiness' || mostrecentword == 'joy' || mostrecentword == 'content' || mostrecentword == 'cheerful' || mostrecentword == 'joy' || mostrecentword == 'glad') {
      emotion = 'happy';
    } else if (mostrecentword == 'sad' || mostrecentword == 'upset' || mostrecentword == 'low' || mostrecentword == 'bad' || mostrecentword == 'lonely' || mostrecentword == 'depressed' || mostrecentword == 'unhappy' || mostrecentword == 'blue' || mostrecentword == 'miserable') {
      emotion = 'sad';
    } else if (mostrecentword == 'angry' || mostrecentword == 'mad' || mostrecentword == 'furious' || mostrecentword == 'hurt' || mostrecentword == 'annoyed' || mostrecentword == 'irate') {
      emotion = 'angry';
    } else if (mostrecentword == 'anxious' || mostrecentword == 'worried' || mostrecentword == 'concerned' || mostrecentword == 'fear' || mostrecentword == 'fearful' || mostrecentword == 'nervous' || mostrecentword == 'panic') {
      emotion = 'anxious';
    } else {
      emotion = '';
    }

    // if the emotion was identified, train the just created markov chain with that emotions corpora
    if (emotion == 'sad') {
      markov.loadText(sad.join(' '));
    } else if (emotion == 'angry') {
      markov.loadText(angry.join(' '));
    } else if (emotion =="anxious") {
      markov.loadText(anxiety.join(' '));
    } else {
      //when no specific emotion is identified, default to happy
      markov.loadText(happy.join(' '));
    }
    
    console.log(emotion);
    
    // generate 2 new sentences and send to be printed
    lines = markov.generateSentences(2);
    drawText();

    console.log(lines);
    console.log(mostrecentword);
  }
}

function keyPressed() {
  if (key === 's') {  
    save(emotion + 'Poem.png');
  }
}