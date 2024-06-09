




status = "";
let objects = [];

function preload() {}

function setup() {
    canvas = createCanvas(380,380);
    canvas.center();

    video = createCapture(VIDEO);
    video.hide();
}

function start() {
    objectDetector = ml5.objectDetector('cocossd',modelLoaded);
    document.getElementById("status").innerHTML = "Status : Detecting Object";
    obj_name = document.getElementById("obj_name").value;
}

function modelLoaded() {
    console.log("Model Loaded");
    status = true;
    gotResult();
}


function gotResult(error, results) {
    if (error) {
        console.error(error);
    } else {
        objects = results;
    }
}



function draw() {
    image(video,0,0,600,500);
    if (status !== "") {
        for (let i = 0; i < objects.length; i++) {
            let confidence = nf(objects[i].confidence * 100, 2, 2) + "%";
            let label = objects[i].label;
            let x = objects[i].x;
            let y = objects[i].y;
            let w = objects[i].width;
            let h = objects[i].height;

            fill(255);
            textSize(20);
            text(label + " " + confidence, x + 10, y + 20);
            noFill();
            stroke(255, 0, 0);
            strokeWeight(2);
            rect(x, y, w, h);

            if (label === obj_name) {
                video.stop();
                objectDetector.detect(gotResult);
                document.getElementById("status").innerHTML = "Status : Object Mentioned Found";
                let synth = window.speechSynthesis;
                let utterThis = new SpeechSynthesisUtterance(obj_name + " found");
                synth.speak(utterThis);
            } else {
                document.getElementById("status").innerHTML = "Status : Object Mentioned Not Found";
            }
        }
    }
}