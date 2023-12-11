let local_sd_api = "https://gpu.gohai.xyz:3000/";
let img;
let openAImessage
let openai_api_proxy = "https://clumsy-special-lemming.glitch.me/";
let msg = "Come up with a object based on the despcription:"

let prompt = ""
let resultTxt = ""
let txt = ""
let promptPattern = /"([^"]*)"/
let content;

let d;
let wait;
let s

let cnv

function preload(assets){
  wait = loadImage('assets/waiting.jpg')
}

function setup() {
  cnv = createCanvas(400, 400);
  cnv.parent(canvasContainer)
  background(0);

  // whenever the button is clicked, call sendMessage
  select("#submit").mouseClicked(sendMessage);
  p = select('#loadtext')
  d = select('#memetext')
  //d.parent(cnv)
  s = 2
  imageMode(CENTER)
  frameRate(10)
  select('#Regenerate').mouseClicked(sendMessage)
  select('#Save').mouseClicked(saveIt)
}
  

function sendMessage() {
  // get the text from the text field
  s = 2
  content = select("#content").value()

  if (content == "") {
    content = "random meme";
  }
  
  messages = [{
    role: "user",
    content: "Please generate a meme based on the prompt'"+ content + "' you don't need to draw the picture, please give me the detailed prompt so that I can draw it with an image generator. After giving me the prompt for the picture, give me a sentence that can be used as the text of the meme. do not tell me anything except for the prompt and the sentence, please reply in the following way 'prompt: sentence:'"
  }];
  
  
  let params = {
    model: "gpt-3.5-turbo",
    messages: messages,
    temperature: 0.7,
  };
  requestOAI("POST", "/v1/chat/completions", params, gotResults);
  console.log(messages)

  // Note: there are additional parameters available, see
  // https://platform.openai.com/docs/api-reference/chat
}

function gotResults(results) {
  //console.log(results);

  openAImessage = results.choices[0].message.content;
  resultTxt = openAImessage.match(promptPattern)
  txt = resultTxt[0];
  prompt = openAImessage.substring(7,openAImessage.length-txt.length-9)
  console.log(txt);
  
  sendSDMessage()
  // a good practice here would be to parse and validate
  // the result we received - e.g. is this a valid hex color
  
}


function sendSDMessage() {
  requestLSD(
    "GET",
    "sdapi/v1/options",
    gotOptions
  );
  
  let modelInput = {
    prompt: prompt,
    // for more parameters, see the WebUI and results.parameters
  };

  requestLSD(
    "POST",
    "sdapi/v1/txt2img",
    modelInput,
    donePredicting
  );

  console.log("Starting prediction, this might take a bit");
}

function gotOptions(results) {
  // console.log(results);
  console.log("Using model " + results.sd_model_checkpoint);
  // use WebUI to change settings
}

function donePredicting(results) {
  console.log(results);
  if (results && results.images.length > 0) {
    img = loadImage('data:image/png;base64,' + results.images[0]);
  }
  s = 1
}

function saveIt(){
  saveCanvas(cnv, content, 'jpg')
}

function draw() {
  background(220);
  if (s == 2) {
    p.html('Please Wait...')
    wait.resize(400,400);
    image(wait,width/2, height/2)
    d.html('')
  }
 
 if (s == 1) {
    imageMode(CENTER);
    image(img, width/2, height/2, img.width, img.height);
    fill(0)
    d.html(txt)
    d.position(0,0);
    //p.html("AI-generated meme about '" + content +  "' be like")
  }
  
}
