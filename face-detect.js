const view = document.getElementById('video');
console.log("Hey Shaun");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.ageGenderNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia({ 
    video: {} 
  },
    (stream) => view.srcObject = stream,
    (err) => console.error(err)
  )
}

video.addEventListener('play', (err) => {
  //create the canvas for the webcam to display
  const canvas = faceapi.createCanvasFromMedia(view)
  //add the canvas to the DOM
  document.body.append(canvas)
  //configure the size of the display
  const displaySize = { 
    width: view.width, 
    height: view.height
   }
   //apply display size to canvas
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    //detect the face
    const detections = await faceapi.detectAllFaces(view, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withAgeAndGender();
    //size the detection to the display size
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    //clear the canvas before drawing the detectors
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    //draw the items to the canvas
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100),
  //if error, console log it
  (err) => console.log(err);
})