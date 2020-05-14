/**
 * Created by gaika on 01.10.2017.
 */


// Инициализация формы

const loginForm = document.getElementById('login-form');
const loginBtn = document.getElementById('login-btn');
const loginInput = document.getElementById('login-text');

const peerConnectionCollection = new PeerConnectionCollection();
const signalConnection = new SignalConnection(io(), peerConnectionCollection);

const selectors = {
  chat: 'chat-box',
  sendButton: 'sendMsg',
  message: 'inputMsg',
  file: 'sendFile',
  messages: 'messages',
  userList: 'user-list',
};

const chat = new Chat({selectors, collection: peerConnectionCollection});

const onLogin = () => {
  const name = loginInput.value;
  if (name.length > 0) {
    loginForm.style.display = 'none';
    signalConnection.send(SignalConnection.EVENT_TYPE.LOGIN, {name: name});
  }
};


loginBtn.onclick = onLogin;


loginInput.onkeyup = (e) => {
  if (e.keyCode === 13) {
    onLogin();
  }
};
