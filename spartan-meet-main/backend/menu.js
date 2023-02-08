let menuForm = document.getElementById("menu__structure");
menuForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let conferenceNum = event.target.conferenceNum.value;
  if (!conferenceNum) {
    conferenceNum = String(Math.floor(Math.random() * 10000));
  }
  sessionStorage.setItem("currUser", event.target.memberName.value);
  window.location = `conference.html?room=${conferenceNum}`;
});

window.onload = function () {
  let currName = sessionStorage.getItem("currUser");
  if (currName) {
    menuForm.memberName.value = currName;
  }
};
