const latestVersion = 20210510;
/**
 * {
 *   version: 20210510,
 *   selectedVideoInputDeviceId: 'foo123'
 * }
 */
let setting;

function initializeSetting() {
  setting = { version: latestVersion };
}

function loadSetting() {
  try {
    const settingText = localStorage.getItem("setting");
    const currentSetting = settingText && JSON.parse(settingText);
    if (latestVersion === currentSetting.version) {
      setting = currentSetting;
    } else {
      initializeSetting();
    }
  } catch (e) {
    initializeSetting();
  } finally {
    console.log("setting", setting);
  }
}

loadSetting();

function saveSetting() {
  console.log("saveSetting", setting);
  localStorage.setItem("setting", JSON.stringify(setting));
}

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
      setting.selectedVideoInputDeviceId = deviceId;
      saveSetting();
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
  if (video.style.transform === "rotateY(180deg)") {
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
          device
          // device.kind + ": " + device.label + " id = " + device.deviceId
        );
      });

    const select = document.querySelector(".select");

    const { selectedVideoInputDeviceId } = setting;

    const isVideoInputDeviceSelected = devices
      .map(({ deviceId }) => deviceId)
      .includes(selectedVideoInputDeviceId);

    select.innerHTML = devices
      .filter(({ kind }) => kind === "videoinput")
      .map(
        (d) =>
          `<option value='${d.deviceId}' ${
            selectedVideoInputDeviceId === d.deviceId ? "selected" : ""
          }>${d.kind}: ${d.label}</option>`
      );

    select.addEventListener("change", (e) => {
      videoStart(e.target.value);
    });

    if (isVideoInputDeviceSelected) {
      videoStart(selectedVideoInputDeviceId);
    }
  } catch (err) {
    console.log(err.name + ": " + err.message);
  }
}

initialize();
