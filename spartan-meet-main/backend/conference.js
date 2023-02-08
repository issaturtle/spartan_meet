let textWhole = document.getElementById("messages");
textWhole.scrollTop = textWhole.scrollHeight;
const chatBox = document.getElementById("msg__Box");
const ch__bn = document.getElementById("chat__btn");
const usrsBox = document.getElementById("usrs__box");
const usrsBn = document.getElementById("usrs__btn");
let viewCanvas = document.getElementById("vsFlow__whole");
let strCanvas = document.getElementsByClassName("vsFlow__users");

let currUsrBox = false;
let presentId = null;
let currChtBx = false;

/**
 * handles hiding the view when you exit video call or go to breakout
 */
function hidingviewCanvas() {
  viewCanvas.style.display = null;
  presentId = null;

  let descendant = viewCanvas.children[0];
  document.getElementById("vsFlow__div").appendChild(descendant);

  for (let i = 0; i < strCanvas.length; i++) {
    strCanvas[i].style.width = "249px";
    strCanvas[i].style.height = "249px";
  }
}
for (let i = 0; i < strCanvas.length; i++) {
  strCanvas[i].addEventListener("click", moreCanvas);
}

/**
 *
 * @param  e event that is being handeled
 * Adjusting the size of the canvas by lenghtening
 */
function moreCanvas(e) {
  let descendant = viewCanvas.children[0];
  if (descendant) {
    document.getElementById("vsFlow__div").appendChild(descendant);
  }
  viewCanvas.appendChild(e.currentTarget);
  viewCanvas.style.display = "block";
  presentId = e.currentTarget.id;
  for (let i = 0; i < strCanvas.length; i++) {
    if (strCanvas[i].id != presentId) {
      strCanvas[i].style.width = "85px";
      strCanvas[i].style.height = "85px";
    }
  }
}

ch__bn.addEventListener("click", () => {
  if (!currChtBx) {
    chatBox.style.display = "block";
  } else {
    chatBox.style.display = "none";
  }

  currChtBx = !currChtBx;
});

usrsBn.addEventListener("click", () => {
  if (!currUsrBox) {
    usrsBox.style.display = "block";
  } else {
    usrsBox.style.display = "none";
  }

  currUsrBox = !currUsrBox;
});

viewCanvas.addEventListener("click", hidingviewCanvas);
