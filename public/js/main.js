const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
let typing = false;
const timeout = undefined;

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // // Get message text
  const x = document.getElementById("editor")
  const y = x.contentWindow || x.contentDocument
  const z = y.document ? y.document : y
  let msg = (z.body.innerHTML)

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // // Clear input
  z.body.innerHTML = "";
  z.body.focus();

});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('div');
  para.classList.add('text');
  para.innerHTML = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    const para = document.createElement('p');
    const icon = document.createElement('i');
    span.innerText = user.username;
    li.className = "w-full flex items-center space-x-4 p-2";
    para.className = "w-8 h-8  grid place-items-center bg-slate-400 rounded-full"
    icon.className = "fas fa-user text-sm text-slate-700 m-1";
    span.className = "text-xl";
    para.appendChild(icon);
    li.appendChild(para);
    li.appendChild(span);
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});

const limit = 5000;

// typing event
const editor = document.getElementById('editor');
$(document).ready(function () {
  $(editor.contentDocument.querySelector('body')).keypress((e) => {
    if (e.which != 13) {
      socket.emit('typing')
    }
  })
});

// Notify typing
socket.on('display', (user) => {
  $('.typing').text(`${user.username} is typing...`);
  setTimeout(() => {
    $('.typing').text('');
  }, limit);

})
