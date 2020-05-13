/**
 * Created by gaika on 02.10.2017.
 */


class Chat {
    /**
     * @param {{chat: string, sendButton: string, message: string, file: string, messages: string, userList: string}} selectors
     * @param {PeerConnectionCollection} collection
     * @constructor
     */
    constructor(selectors, collection) {
        this._userList = document.getElementById(selectors.userList);
        this._message = document.getElementById(selectors.message);
        this._file = document.getElementById(selectors.file);
        this._chat = document.getElementById(selectors.chat);
        this._messages = document.getElementById(selectors.messages);
        this._sendButton = document.getElementById(selectors.sendButton);

        this._pcc = collection;
        this._pcc.onNewPeerConnection = this._onNewPeer.bind(this);
        this._pcc.onDeletePeerConnection = this._onDeletePeer.bind(this);

        this._subscribeToEvents();

        this._recivedFileMessages = {};
    }
}


/**
 * @param {PeerConnection} connection
 * @private
 */
Chat.prototype._onNewPeer = function(connection) {
    const infoMessage = drawInfoMessage('Пользователь ' + connection.name + ' присоединился к чату');

    if (this._messages.childElementCount > 0) {
        this._messages.insertBefore(infoMessage, this._messages.childNodes[0]);
    } else {
        this._messages.appendChild(infoMessage);
    }

    connection.onTextMessage = this._onTextMessage.bind(this);
    connection.onFileMessage = this._onFileMessageUpload.bind(this);

    this._updateUserList();
};


/**
 * @param {string} name
 * @private
 */
Chat.prototype._onDeletePeer = function(name) {
    const infoMessage = drawInfoMessage('Пользователь ' + name + ' покинул чат');

    if (this._messages.childElementCount > 0) {
        this._messages.insertBefore(infoMessage, this._messages.childNodes[0]);
    } else {
        this._messages.appendChild(infoMessage);
    }

    this._updateUserList();
};


/**
 * @private
 */
Chat.prototype._updateUserList = function() {
    this._userList.innerHTML = '';
    this._pcc.getNames().forEach(name => {
        this._userList.appendChild(drawUser(name));
    });
};


/**
 * @private
 */
Chat.prototype._subscribeToEvents = function() {
    this._sendButton.onclick = this._onSendButtonClick.bind(this);
    this._message.onkeyup = e => {
        if (e.keyCode === 13) {
            this._onSendButtonClick();
        }
    };
    this._file.onchange = this._onFileChange.bind(this);

};


/**
 * @private
 */
Chat.prototype._onSendButtonClick = function() {
    if (this._message.value.length > 0) {
        this._pcc.send({
            content: this._message.value,
            type: 'text'
        });
        const messageBox = drawMessage(this._message.value, true, 'Я');
        if (this._messages.childElementCount > 0) {
            this._messages.appendChild(messageBox);
        } else {
            this._messages.insertBefore(messageBox, this._messages.childNodes[0]);
        }
        this._message.value = '';
        this._file.value = '';
    }
};


/**
 *
 */
Chat.prototype._onFileChange = function(event) {
    FileInput.createMessage(event.target.files[0], this._pcc.send.bind(this._pcc), this._onUploadFile.bind(this));
};


/**
 * @param {{name: string, content: string}} message
 * @private
 */
Chat.prototype._onTextMessage = function(message) {
    const messageBox = drawMessage(message.content, false, message.name);
    this._drawMessageBox(messageBox);
};


/**
 * @param {{name: string, chunk: Chunk}} event
 * @private
 */
Chat.prototype._onFileMessageUpload = function(event) {
    const chunk = event.chunk;
    let rfm = this._recivedFileMessages[chunk.fileId];
    if (rfm) {
        rfm.add(chunk);
    } else {
        rfm = new FileMessage();
        const fileBox = drawFileMessage(rfm, false, event.name);
        this._drawMessageBox(fileBox);
        rfm.add(chunk);
        this._recivedFileMessages[rfm.id] = rfm;
    }
};


/**
 * @param  {FileMessage} rfm
 * @private
 */
Chat.prototype._onUploadFile = function(rfm) {
    const fileBox = drawFileMessage(rfm, true, 'Я');
    this._drawMessageBox(fileBox);
};


/**
 * @param {Element} elem
 */
Chat.prototype._drawMessageBox = function(elem) {
    if (this._messages.childElementCount > 0) {
        this._messages.appendChild(elem);
    } else {
        this._messages.insertBefore(elem, this._messages.childNodes[0]);
    }
};


/**
 * @type {Element}
 */
Chat.prototype._chat;


/**
 * @type {Element}
 */
Chat.prototype._userList;


/**
 * @type {Element}
 */

Chat.prototype._message;


/**
 * @type {PeerConnectionCollection}
 */
Chat.prototype._pcc;


/**
 * @type {Element}
 */
Chat.prototype._sendButton;


/**
 * @type {Element}
 */
Chat.prototype._file;


/**
 * @type {Array}
 */
Chat.prototype._messages;
