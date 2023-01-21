//Variables
const startBtn = document.getElementById('startBtn');
const audioP = document.getElementById('audio');
const resName = document.getElementById("resTag");
const resAccu = document.getElementById("resAccu");
const a1 = document.getElementById("a1");
const classifier = ml5.soundClassifier("https://storage.googleapis.com/tm-model/Y3gMlKsJp/model.json", modelLoaded)
var synth = window.speechSynthesis;
var micState = false;
var times = 0;

// Function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function speak(text) {
  synth.speak(new SpeechSynthesisUtterance(text))
}
function modelLoaded() {
  console.log('Model Loaded!')
}
function gotResult(error, results) {
  if(error) {throw new Error("Sound Recog Error - " + error)}
  else if(micState) {
    resName.innerText = results[0].label;
    resAccu.innerText = ((results[0].confidence.toFixed(4)*100)+"%");
    console.log(results)
    control(results[0].label)
  } else {
    resName.innerText = "Stopped"
    resAccu.innerText = "Stopped"
    control("RESET")
  }
}
function control(type) {
  if(type == "RESET") {a1.src = "./cdn/png/aliens-01.png";}
  else if(type == "Cat") {
    a1.src = "./cdn/png/aliens-01.png"
  }

  else if(type == "Dog") {
    a1.src = "./cdn/png/aliens-02.jpeg"
  }
  else if(type == "Crow") {
    a1.src = "./cdn/png/aliens-03.jpeg"
  }
}

//Calls
startBtn.onclick = (async function() {
  speak('Lets begin our hearing!');
  await sleep(1000);
  startBtn.classList.add('disabled');
  micState = true;

  let audioIN = { audio: true };
  navigator.mediaDevices.getUserMedia(audioIN).then(function(Stream) {
    let mediaRecorder = new MediaRecorder(Stream);
    mediaRecorder.start();

    let dataArray = [];

    mediaRecorder.ondataavailable = function (ev) {
      dataArray.push(ev.data);
    }

    setTimeout(() => {
      mediaRecorder.stop();
    }, 1000);
    setTimeout(() => {
      micState = false;
      startBtn.classList.remove('disabled')
      console.log('loggedd')
    }, 24000);

    mediaRecorder.onstop = function(ev) {
      let audioData = new Blob(dataArray, {'type': 'audio/mp3;'})
      dataArray = []
      let audioSrc = window.URL.createObjectURL(audioData);
      audioP.src = audioSrc;
      classifier.classify(audioP, gotResult)
      console.log(mediaRecorder.state)
    }
  }).catch(function(err) {
    console.log(err.name, err.message)
  })
});




// Code
console.log("ML5 Version - " + ml5.version)
/*
Swal.fire({
  icon: 'info',
  title: 'Welcome!',
  text: 'Here is a small tutorial of "Colour Mash"',
  showCancelButton: true,
  confirmButtonText: 'Tutorial',
  confirmButtonColor: '#34c9eb',
  cancelButtonText: 'No, Thanks',
  allowOutsideClick: false,
  allowEscapeKey: false,
}).then((result) => {
  if(result.isDismissed) {
    Swal.fire({
      icon: 'success',
      title: 'Cancelled Tutorial',
      timer: 3000,
      timerProgressBar: true,
    })
  } else if(result.isConfirmed) {
    Swal.fire({
      icon: 'success',
      title: 'Starting Tutorial',
      timer: 2000,
      timerProgressBar: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      Swal.fire({
        icon: 'info',
        title: 'How to Play',
        text: "In this game, you control the monsters with colours you say...",
        timer: 6000,
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        Swal.fire({
          icon: 'info',
          title: 'Making Sounds',
          html: "Click <b>START</b>, and say a colour, like red. The respective monster will follow",
          timer: 6000,
          timerProgressBar: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then((result) => {
          Swal.fire({
            icon: 'succes',
            title: "You're ready!",
            html: "Well, thats it! You are now an experience Colour Controller!",
            timer: 5000,
            timerProgressBar: true,
        })
      })
    })
  })
}})
*/
