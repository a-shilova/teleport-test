/**
 * Created by gaika on 01.10.2017.
 */


//Инициализация формы

var loginForm = document.getElementById('login-form');
var loginBtn = document.getElementById('login-btn');
var loginInput = document.getElementById('login-text');

var peerConnectionCollection = new PeerConnectionCollection();
var signalConnection = new SignalConnection(io(), peerConnectionCollection);

var chatSelectors = {
    chat: 'chat-box',
    sendButton: 'sendMsg',
    message: 'inputMsg',
    file: 'sendFile',
    messages: 'messages',
    userList: 'user-list'
};

var chat = new Chat(chatSelectors, peerConnectionCollection);

var onLogin = function() {
    var name = loginInput.value;
    if (name.length > 0) {
        loginForm.style.display = 'none';
        signalConnection.send(SignalConnection.EVENT_TYPE.LOGIN, {name: name});
    }
};


loginBtn.onclick = onLogin;


loginInput.onkeyup = function(e) {
    if (e.keyCode === 13) {
        onLogin();
    }
};
