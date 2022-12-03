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

  console.log(tensor.shape)
  var tensor2 = tensor.div(tf.scalar(255))
  console.log(tensor2.shape)
  tf.reshape(tensor2, tensor.shape)
  console.log(tensor2.shape)
  const convnetModel = await tf.loadLayersModel('CNN/model.json');
  const convnetPrediction = convnetModel.predict(tensor2).dataSync();
  const response = await fetch('categories.json');
  const categories = await response.json();
  const predictionLabel = Object.keys(categories)
  .find(key => categories[key].findIndex(x => x == 1) == 
               convnetPrediction.findIndex(x => x == 1));
  
  const predictionText = document.getElementById('predictionText');
  const predictionArea = document.getElementById('predictionArea');

  predictionText.innerHTML = predictionLabel;
  predictionArea.classList.remove('d-none');
}