"use strict";

let classifier; // holds the ml5 image classifier instance
let inputImage = null; // holds the uploaded image (p5.Element) for both rendering and classification
let label0 = "", confidence0 = 0;
let label1 = "", confidence1 = 0;

// Special p5.js function that runs before setup() that is used to load assets like models or images that
// must be ready before the rest of the program runs
// p5.js calls the following functions in the following order:
// 1. preload()
// 2. setup()
// 3. draw()
function preload() {
    // load a pretrained image classification model from teachable machine
    classifier = ml5.imageClassifier("https://teachablemachine.withgoogle.com/models/NR7nPD0KR/"); // Male vs female
}

function setup() {
    const canvas = createCanvas(480, 360);
    canvas.parent("image_container");
    background("#c0c0c0");

    document.getElementById("imageUpload").addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            // creates a p5 DOM image element (wrapping an HTML <img>)
            const img = createImg(URL.createObjectURL(file), "", "", () => {
                img.hide(); // Keep the DOM clean
                inputImage = img;
                // img.elt retrieves the underlying raw <img> element as required by ml5.classify()
                // this is an asynchronous function which calls processresults function when the classification is completed
                classifier.classify(img.elt).then(processresults).catch(err => {
                    console.error("Classification error:", err);
                });
            });
        }
    });
}

function processresults(results) {
    if (results && results.length > 0) {
        label0 = results[0].label;
        confidence0 = results[0].confidence;

        if (results.length > 1) {
            label1 = results[1].label;
            confidence1 = results[1].confidence;
        }
    }
}

function draw() {
    background("#c0c0c0"); // clear the canvas

    if (inputImage) {
        image(inputImage, 0, 0, width, height); // draw the p5-wrapped image
    }

    document.getElementById("results").innerHTML = label0
        ? `${label0}: ${(confidence0 * 100).toFixed(1)}%` +
        (label1 ? `, ${label1}: ${(confidence1 * 100).toFixed(1)}%` : "")
        : "Please upload an image...";
}