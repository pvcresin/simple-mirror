function videoStart(deviceId) {
  var constraints = {
    audio: false,
    video: {
      facingMode: "user",
      deviceId,
    },
  };

  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    var video = document.querySelector(".video");
    video.srcObject = stream;
    video.onloadedmetadata = function (e) {
      video.play();
    };
  });
}

function videoStop() {
  navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: {
        facingMode: "user",
      },
    })
    .then(function (stream) {
      var video = document.querySelector(".video");
      video.srcObject = stream;
      video.onloadedmetadata = function (e) {
        stream.getVideoTracks()[0].stop();
      };
    });
}

function reverse() {
  var video = document.querySelector(".video");
  if (video.style.transform) {
    video.style.transform = "";
  } else {
    video.style.transform = "rotateY(180deg)";
  }
}

async function initialize() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    devices
      .filter(({ kind }) => kind === "videoinput")
      .forEach(function (device) {
        console.log(
          device.kind + ": " + device.label + " id = " + device.deviceId
        );
      });

    const select = document.querySelector(".select");

    select.innerHTML = devices
      .filter(({ kind }) => kind === "videoinput")
      .map(
        (d) => `<option value='${d.deviceId}'>${d.kind}: ${d.label}</option>`
      );

    select.addEventListener("change", (e) => {
      videoStart(e.target.value);
    });
  } catch (err) {
    console.log(err.name + ": " + err.message);
  }
}

initialize();
