import * as tf from '@tensorflow/tfjs';

const inputElement = document.getElementById("fileInput");
inputElement.addEventListener("change", (event) => {
    const existingImg = document.getElementById("previewImage");
    existingImg?.remove();

    const previewArea = document.getElementById("previewArea");
    const predictButton = document.getElementById("predictButton");
    const selectedFile = event.target.files[0];
    const previewImg = document.createElement("img");
    previewImg.id = "previewImage";
    previewImg.file = selectedFile;
    previewArea.appendChild(previewImg);
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImg.src = e.target.result;
        previewArea.classList.remove('d-none');
        predictButton.classList.remove('d-none');
        predictButton.addEventListener('click', predictLabels, false);
    };
    reader.readAsDataURL(selectedFile);
}, false);

async function predictLabels() {
    const fileImg = document.getElementById("previewImage");
    const tensor = tf.browser.fromPixels(fileImg, 1).expandDims(0);
    var norm = tf.constant(255)
	  tensor = tf.math.divide(tensor, norm)
    const convModel = await tf.loadLayersModel('CNN/model.json');
    const convPrediction = convModel.predict(tensor.dataSync());
	
  //  const perceptronModel = await tf.loadLayersModel('Perceptron/model.json');
  //  const perceptronPrediction = perceptronModel.predict(tensor).dataSync();
	
    const response = await fetch('categories.json');
    const categories = await response.json();
    const convLabel = Object.keys(categories)
    .find(key => categories[key].findIndex(x => x == 1) == 
                 convPrediction.findIndex(x => x == 1));
				 
//	 const perceptronLabel = Object.keys(categories)
  //  .find(key => categories[key].findIndex(x => x == 1) == 
    //             perceptronPrediction.findIndex(x => x == 1));
    
    const predictionText = document.getElementById('predictionText');
    const predictionArea = document.getElementById('predictionArea');

    predictionText.innerHTML = convLabel;// + " / " + perceptronLabel;
    predictionArea.classList.remove('d-none');
}

console.log(2 + 5)