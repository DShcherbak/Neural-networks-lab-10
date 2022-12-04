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
    const convModel = await tf.loadLayersModel('CNN/model.json');
    var tensor2 = tensor.div(tf.scalar(255))
  console.log(tensor2.shape)
 // tensor.print()
 // tensor2.print()
  //tf.reshape(tensor2, tensor.shape)
  //console.log(tensor2.shape)
    const prediction = convModel.predict(tensor2).dataSync();
    console.log(prediction)
    var max_prediction = [0,0,0], max_index = [0,0,0]
    for(var i = 0; i < prediction.length; i++){
      for(var j = 0; j < max_prediction.length; j++){
        if(prediction[i] > max_prediction[j]){
          max_prediction[max_prediction.length-1] = prediction[i]
          max_index[max_index.length-1] = i
          for(var k = max_prediction.length-1; k > j; k--){
            max_prediction[k] = [max_prediction[k-1], max_prediction[k-1] = max_prediction[k]][0];
            max_index[k] = [max_index[k-1], max_index[k-1] = max_index[k]][0];
          }
          break;
        }
      }  
    }
    console.log(max_prediction, max_index)
    const response = await fetch('categories.json');
    const categories = await response.json();
    var predictionLabel = "";
    for(var i = 0; i < max_index.length; i++){
      predictionLabel += Object.keys(categories)
      .find(key => categories[key].findIndex(x => x == 1) == 
                      max_index[i]);
      if(i != max_index.length-1){
        predictionLabel += ", "
      }
    }
    
    const predictionText = document.getElementById('predictionText');
    const predictionArea = document.getElementById('predictionArea');

    predictionText.innerHTML = predictionLabel;
    predictionArea.classList.remove('d-none');
}