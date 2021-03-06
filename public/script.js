const socket = io();

const inboxPeople = document.querySelector(".inbox-people");
const inputField = document.querySelector(".message-form-input");
const messageForm = document.querySelector(".message-form");
const messageBox = document.querySelector(".messages-history");
const fallback = document.querySelector(".fallback");

let userName = "";

const newUserConnected = (user) => {
    userName = user || `User${Math.floor(Math.random() * 1000000)}`;
    socket.emit("new user", userName);
    addToUsersBox(userName);
};

const addToUsersBox = (userName) => {
    if (!!document.querySelector(`.${userName}-userlist`)) {
        return;
    }

    const userBox = `
    <div class="chat-ib ${userName}-userlist">
      <h5>${userName}</h5>
    </div>
  `;
    inboxPeople.innerHTML += userBox;
};

const addNewMessage = ({ user, message }) => {
    const time = new Date();
    const formattedTime = time.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });

    const receivedMsg = `
  <div class="incoming-message">
  <div class='message-container'>
    <div class="received-message">
      <p>${message}</p>
    </div>
    <div class="message-info received-info">
        <span class="message-author">${user}</span>
        <span class="time-date">${formattedTime}</span>
      </div>
      </div>
  </div>`;

    const myMsg = `
  <div class="outgoing-message">
    <div class='message-container'>
    <div class="sent-message">
      <p>${message}</p>
    </div>
    <div class="message-info sent-info">
        <span class="time-date">${formattedTime}</span>
      </div>
      </div>
  </div>`;

    messageBox.innerHTML += user === userName ? myMsg : receivedMsg;
};

// new user is created so we generate nickname and emit event
newUserConnected();

messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!inputField.value) {
        return;
    }

    socket.emit("chat message", {
        message: inputField.value,
        nick: userName,
    });

    inputField.value = "";
});

inputField.addEventListener("keyup", () => {
    socket.emit("typing", {
        isTyping: inputField.value.length > 0,
        nick: userName,
    });
});

socket.on("new user", function(data) {
    data.map((user) => addToUsersBox(user));
});

socket.on("user disconnected", function(userName) {
    document.querySelector(`.${userName}-userlist`).remove();
});

socket.on("chat message", function(data) {
    addNewMessage({ user: data.nick, message: data.message });
});


socket.on("typing", function(data) {
    const { isTyping, nick } = data;

    if (!isTyping) {
        fallback.innerHTML = "";
        return;
    }

    fallback.innerHTML = `<p>${nick} is typing...</p>`;
});

const fileInput = document.querySelector('#file-input');

fileInput.addEventListener('change', (event) => {
    file = fileInput.files[0];
    const fileURL = URL.createObjectURL(file);
    alert(fileURL);
    document.querySelector("#video-player").src = fileURL;
});

document.onfullscreenchange = function(event) {
    console.log("FULL SCREEN CHANGE")
};