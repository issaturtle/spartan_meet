const APP_ID = "bf95131d776e4ec8b7330ceba59ba1a2";

let memberNum = sessionStorage.getItem("uid");
if (!memberNum) {
  memberNum = String(Math.floor(Math.random() * 10000));
  sessionStorage.setItem("uid", memberNum);
}
const request = window.location.search;
const linkStuff = new URLSearchParams(request);
let conferenceNum = linkStuff.get("room");

if (!conferenceNum) {
  conferenceNum = "main";
}
let channel, realTimeClient, currClient;

let token = null;

let mmName = sessionStorage.getItem("currUser");
if (mmName) {
} else {
  window.location = "menu.html";
}
let mrAlert;
let showMonitor = false;
let avidAlert = [];
let allUsers = {};

/**
 * start call and access microphone and camera
 */
async function startCall() {
  document.getElementById("joinCallBtn").style.display = "none";
  document.getElementsByClassName("vsFlow__btns")[0].style.display = "flex";

  avidAlert = await AgoraRTC.createMicrophoneAndCameraTracks(
    {},
    {
      encoderConfig: {
        width: { min: 640, ideal: 1920, max: 1920 },
        height: { min: 480, ideal: 1080, max: 1080 },
      },
    }
  );

  let streamer = `<div class="vsFlow__users" id="vdBox-${memberNum}">
                      <div class="v-p" id="user-${memberNum}"></div>
                   </div>`;
  document
    .getElementById("vsFlow__div")
    .insertAdjacentHTML("beforeend", streamer);
  document
    .getElementById(`vdBox-${memberNum}`)
    .addEventListener("click", moreCanvas);

  avidAlert[1].play(`user-${memberNum}`);
  await currClient.publish([avidAlert[0], avidAlert[1]]);
}

/**
 * Option for the screen and camera
 */
async function ScreenToCam() {
  let streamer = `<div class="vsFlow__users" id="vdBox-${memberNum}">
                    <div class="v-p" id="user-${memberNum}"></div>
                 </div>`;
  viewCanvas.insertAdjacentHTML("beforeend", streamer);
  await avidAlert[1].setMuted(true);
  await avidAlert[0].setMuted(true);

  document.getElementById("btnVoice").classList.remove("active");
  document.getElementById("btnScreenShare").classList.remove("active");

  avidAlert[1].play(`user-${memberNum}`);
  await currClient.publish([avidAlert[1]]);
}
/**
 * Join call from main
 */
async function joinCall() {
  realTimeClient = await AgoraRTM.createInstance(APP_ID);
  await realTimeClient.login({ uid: memberNum, token });

  await realTimeClient.addOrUpdateLocalUserAttributes({ name: mmName });

  channel = await realTimeClient.createChannel(conferenceNum);
  await channel.join();

  getMembers();
  insertBotText(`Hello ${mmName}!`);

  currClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  await currClient.join(APP_ID, conferenceNum, token, memberNum);

  currClient.on("user-published", removeUser);
  currClient.on("user-left", publishUsers);
  channel.on("MemberLeft", memberLeft);
  channel.on("ChannelMessage", channelMsg);
  channel.on("MemberJoined", memberJoined);
}
/**
 * posts the user in the document 
 */

async function publishUsers(user) {
  delete allUsers[user.uid];
  let vdBox = document.getElementById(`vdBox-${user.uid}`);
  if (vdBox) {
    vdBox.remove();
  }

  if (presentId === `vdBox-${user.uid}`) {
    viewCanvas.style.display = null;

    let strBox = document.getElementsByClassName("vsFlow__users");

    for (let i = 0; i< strBox.length; i++) {
      strBox[i].style.width = "299px";
      strBox[i].style.height = "299px";
    }
  }
}

/**
 * 
 * @param  user is the user 
 * @param  videoAudio is the audio of the video to be mutated
 * Remove the user from the document 
 */
async function removeUser(user, videoAudio) {
  allUsers[user.uid] = user;

  await currClient.subscribe(user, videoAudio);

  let player = document.getElementById(`vdBox-${user.uid}`);
  if (player === null) {
    player = `<div class="vsFlow__users" id="vdBox-${user.uid}">
                <div class="v-p" id="user-${user.uid}"></div>
            </div>`;

    document
      .getElementById("vsFlow__div")
      .insertAdjacentHTML("beforeend", player);
    document
      .getElementById(`vdBox-${user.uid}`)
      .addEventListener("click", moreCanvas);
  }

  if (viewCanvas.style.display) {
    let videoFrame = document.getElementById(`vdBox-${user.uid}`);
    videoFrame.style.width = "90px";
    videoFrame.style.height = "90px";
  }
  if (videoAudio === "audio") {
    user.audioTrack.play();
  }
  if (videoAudio === "video") {
    user.videoTrack.play(`user-${user.uid}`);
  }
}
/**
 * 
 * @param event is the event being handeled
 * Showing the video upon request 
 */
async function enableVideo(event) {
  let btn = event.currentTarget;

  if (avidAlert[1].muted) {
    btn.classList.add("active");
    await avidAlert[1].setMuted(false);
  } else {
    btn.classList.remove("active");
    await avidAlert[1].setMuted(true);
  }
}
/**
 * 
 * @param event is event being handeled
 * enable the screen sharing 
 */
async function enableMonitor(event) {
  let btnScreen = event.currentTarget;
  let btnCam = document.getElementById("btnCam");

  if (!showMonitor) {
    showMonitor = true;

    btnScreen.classList.add("active");
    btnCam.classList.remove("active");
    btnCam.style.display = "none";

    mrAlert = await AgoraRTC.createScreenVideoTrack();

    document.getElementById(`vdBox-${memberNum}`).remove();
    viewCanvas.style.display = "block";

    let streamer = `<div class="vsFlow__users" id="vdBox-${memberNum}">
                <div class="v-p" id="user-${memberNum}"></div>
            </div>`;

    viewCanvas.insertAdjacentHTML("beforeend", streamer);
    document
      .getElementById(`vdBox-${memberNum}`)
      .addEventListener("click", moreCanvas);

    presentId = `vdBox-${memberNum}`;
    mrAlert.play(`user-${memberNum}`);

    await currClient.unpublish([avidAlert[1]]);
    await currClient.publish([mrAlert]);
    let strBox = document.getElementsByClassName("vsFlow__users");
    for (let i = 0; i <  strBox.length; i++) {
      if (strBox[i].id != presentId) {
        strBox[i].style.height = "99px";
        strBox[i].style.width = "99px";
      }
    }
  } else {
    showMonitor = false;
    btnCam.style.display = "block";
    document.getElementById(`vdBox-${memberNum}`).remove();
    await currClient.unpublish([mrAlert]);

    ScreenToCam();
  }
}
/**
 * @param event is event being handeled
 * enable the voice 
 */
async function enableVoice(event) {
  let btn = event.currentTarget;

  if (avidAlert[0].muted) {
    btn.classList.add("active");
    await avidAlert[0].setMuted(false);
  } else {
    btn.classList.remove("active");
    await avidAlert[0].setMuted(true);
  }
}
/**
 * @param e is event being handeled
 * allow the user to leave the call
 */
async function leaveCall(e) {
  e.preventDefault();

  document.getElementsByClassName("vsFlow__btns")[0].style.display = "none";
  document.getElementById("joinCallBtn").style.display = "block";

  for (let i = 0; i < avidAlert.length; i++) {
    avidAlert[i].stop();
    avidAlert[i].close();
  }

  await currClient.unpublish([avidAlert[0], avidAlert[1]]);

  if (mrAlert) {
    await currClient.unpublish([mrAlert]);
  }

  document.getElementById(`vdBox-${memberNum}`).remove();

  if (presentId === `vdBox-${memberNum}`) {
    viewCanvas.style.display = null;

    for (let i = 0; i < strCanvas.length; i++) {
      strCanvas[i].style.height = "299px";
      strCanvas[i].style.width = "299px";
    }
  }

  channel.sendMessage({
    text: JSON.stringify({ type: "user_left", uid: memberNum }),
  });
}

document.getElementById("joinCallBtn").addEventListener("click", startCall);
document.getElementById("btnCam").addEventListener("click", enableVideo);
document.getElementById("btnVoice").addEventListener("click", enableVoice);
document.getElementById("btnLeave").addEventListener("click", leaveCall);
document
  .getElementById("btnScreenShare")
  .addEventListener("click", enableMonitor);
joinCall();
