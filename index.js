
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

function predictLabels() {
    const img = document.getElementById("previewImage");

    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
    console.log(canvas[0][0]);

    const tensor = tf.browser.fromPixels(img, 1).expandDims(0);
    
    const convModel =  tf.loadLayersModel('CNN/model.json'); //aw
    const convPrediction = convModel.predict(tensor.dataSync());
    
	
  //  const perceptronModel = await tf.loadLayersModel('Perceptron/model.json');
  //  const perceptronPrediction = perceptronModel.predict(tensor).dataSync();
	
    const response =  fetch('categories.json'); //aw
    const categories =  response.json(); //aw
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

