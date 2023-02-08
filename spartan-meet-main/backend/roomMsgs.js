/**
 *
 * @param  UserNum is the users id
 * Insert the welcome message to the user when they join from bot and establish relationship
 */
async function memberJoined(UserNum) {
  insertUser(UserNum);

  let members = await channel.getMembers();
  let { name } = await realTimeClient.getUserAttributesByKeys(UserNum, [
    "name",
  ]);
  renderTotalCallers(members);
  insertBotText(`Hello ${name}`);
}

/**
 *
 * @param  members the members in the chat
 * update the documente with the toal number of members
 */
async function renderTotalCallers(membersList) {
  let total = document.getElementById("usrs__numbers");
  total.innerText = membersList.length;
}

/**
 *
 * @param  UserNum is the users id
 * Insert the user to the streaming
 */
async function insertUser(UserNum) {
  const { name } = await realTimeClient.getUserAttributesByKeys(UserNum, [
    "name",
  ]);
  const memberInfo = `<div class="usrs__whole" id="usrs__${UserNum}__whole">
  <span class="cht__state"></span>
  <p class="usr_name">${name}</p></div>`;
  const usrsWhole = document.getElementById("usrs__array");

  usrsWhole.insertAdjacentHTML("beforeend", memberInfo);
}

/**
 *
 * @param UserNum is the the user identification
 * removed member from the video stream and updates total members
 */
async function memberLeft(UserNum) {
  endUserCall(UserNum);

  let members = await channel.getMembers();
  renderTotalCallers(members);
}

/**
 * Get members and add them to the document
 */
async function getMembers() {
  let members = await channel.getMembers();
  renderTotalCallers(members);
  for (let i = 0; i < members.length; i++) {
    insertUser(members[i]);
  }
}

/**
 *
 * @param  event is the event being handeled
 * send the text message
 */
async function sendMessage(event) {
  event.preventDefault();

  const msg = event.target.message.value;
  channel.sendMessage({
    text: JSON.stringify({
      type: "chat",
      message: msg,
      displayName: mmName,
    }),
  });

  insertText(mmName, msg);
  event.target.reset();
}
/**
 *
 * @param  messageData is the data for the message
 * @param  UserNum is the identification for the user
 * Helps to Insert text into the chat document
 */
async function channelMsg(messageData, UserNum) {
  const chat = JSON.parse(messageData.text);

  if (chat.type === "chat") {
    insertText(chat.displayName, chat.message);
  }

  if (chat.type === "user_left") {
    document.getElementById(`vdBox-${chat.uid}`).remove();
    if (presentId === `vdBox-${memberNum}`) {
      viewCanvas.style.display = null;

      for (let index = 0; index < strCanvas.length; index++) {
        strCanvas[index].style.width = "295px";
        strCanvas[index].style.height = "295px";
      }
    }
  }
}
/**
 *
 * @param  msg the message of the bot that is automated
 * Inserting bots message on the chat box
 */
async function insertBotText(msg) {
  let wholeTxt = document.getElementById("messages");

  let presentTxt = `<div class="cht__whole">
                        <div class="cht__botSh">
                            <strong class="cht__author__bot"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-robot" viewBox="0 0 16 16">
                            <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5ZM3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.58 26.58 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.933.933 0 0 1-.765.935c-.845.147-2.34.346-4.235.346-1.895 0-3.39-.2-4.235-.346A.933.933 0 0 1 3 9.219V8.062Zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a24.767 24.767 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25.286 25.286 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135Z"/>
                            <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2V1.866ZM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5Z"/>
                          </svg> Spartan Bot</strong>
                            <p class="cht__content__bot">${msg} </p>
                        </div>
                    </div>`;

  wholeTxt.insertAdjacentHTML("beforeend", presentTxt);

  let prevText = document.querySelector("#messages .cht__whole:last-child");
  if (prevText) {
    prevText.scrollIntoView();
  }
}
/**
 *
 * @param userName the name of the author
 * @param msg the message that the author writes
 */
async function insertText(userName, msg) {
  const presentTxt = `<div class="cht__whole">
                        <div class="cht__Sh">
                            <strong class="cht__author">${userName}</strong>
                            <p class="cht__content">${msg}</p></div></div>`;
  const wholeTxt = document.getElementById("messages");
  wholeTxt.insertAdjacentHTML("beforeend", presentTxt);

  const prevText = document.querySelector("#messages .cht__whole:last-child");
  if (prevText) {
    prevText.scrollIntoView();
  }
}

/**
 * leave channel by closing the window
 */
async function closeChannel() {
  await channel.leave();
  await realTimeClient.logout();
}
/**
 *
 * @param UserNum is the users identification
 * remove the user from the document and update state
 */
async function endUserCall(UserNum) {
  let wholeUsrs = document.getElementById(`usrs__${UserNum}__whole`);
  let name = wholeUsrs.getElementsByClassName("usr_name")[0].textContent;
  insertBotText(`${name} left conference`);
  wholeUsrs.remove();
}

window.addEventListener("beforeunload", closeChannel);
let messageForm = document.getElementById("cht__structure");
messageForm.addEventListener("submit", sendMessage);
