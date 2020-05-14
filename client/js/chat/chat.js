/**
 * Created by gaika on 02.10.2017.
 */

/**
 * @class {Chat}
 * @constructor
 */
class Chat {
  /**
  * @param {Chat.Dependencies} deps
  * @constructor
  */
  constructor(deps) {
    /**
     * @type {Element}
     * @private
     */
    this._chatEl = document.getElementById(deps.selectors.chat);

    /**
     * @type {Element}
     * @private
     */
    this._userListEl = document.getElementById(deps.selectors.userList);

    /**
     * @type {Element}
     * @private
     */
    this._messageEl = document.getElementById(deps.selectors.message);

    /**
     * @type {Element}
     * @private
     */
    this._sendButton = document.getElementById(deps.selectors.sendButton);

    /**
     * @type {Element}
     * @private
     */
    this._file = document.getElementById(deps.selectors.file);

    /**
     * @type {Element}
     * @private
     */
    this._messagesEl = document.getElementById(deps.selectors.messages);

    /**
   * @type {PeerConnectionCollection}
   * @private
   */
    this._pcc = deps.collection;

    this._pcc.onNewPeerConnection = this._onNewPeer.bind(this);
    this._pcc.onDeletePeerConnection = this._onDeletePeer.bind(this);

    this._subscribeToEvents();

    this._recivedFileMessages = {};
  }

  /**
   * @param {PeerConnection} connection
   * @private
   */
  _onNewPeer(connection) {
    const infoMessage = this._drawInfoMessage(
        'Пользователь ' +
      connection.name +
      ' присоединился к чату',
    );

    if (this._messagesEl.childElementCount > 0) {
      this._messagesEl.insertBefore(
          infoMessage,
          this._messagesEl.childNodes[0],
      );
    } else {
      this._messagesEl.appendChild(infoMessage);
    }

    connection.onTextMessage = this._onTextMessage.bind(this);
    connection.onFileMessage = this._onFileMessageUpload.bind(this);

    this._updateUserList();
  };

  /**
   * @param {string} name
   * @private
   */
  _onDeletePeer(name) {
    const textMessage = 'Пользователь ' + name + ' покинул чат';
    const infoMessageEl = this._drawInfoMessage(textMessage);

    if (this._messagesEl.childElementCount > 0) {
      this._messagesEl.insertBefore(
          infoMessageEl,
          this._messagesEl.childNodes[0],
      );
    } else {
      this._messagesEl.appendChild(infoMessageEl);
    }

    this._updateUserList();
  }

  /**
   * @private
   */
  _updateUserList() {
    this._userListEl.innerHTML = '';
    this._pcc.getNames().forEach((name) => {
      this._userListEl.appendChild(this._drawUser(name));
    });
  }

  /**
   * @private
   */
  _subscribeToEvents() {
    this._sendButton.onclick = this._onSendButtonClick.bind(this);
    this._messageEl.onkeyup = (e) => {
      if (e.keyCode === 13) {
        this._onSendButtonClick();
      }
    };
    this._file.onchange = this._onFileChange.bind(this);
  }

  /**
   * @private
   */
  _onSendButtonClick() {
    if (this._messageEl.value.length > 0) {
      this._pcc.send({
        content: this._messageEl.value,
        type: 'text',
      });
      const messageBox = this._drawMessage(this._messageEl.value, true, 'Я');
      if (this._messagesEl.childElementCount > 0) {
        this._messagesEl.appendChild(messageBox);
      } else {
        this._messagesEl
            .insertBefore(messageBox, this._messagesEl.childNodes[0]);
      }
      this._messageEl.value = '';
      this._file.value = '';
    }
  }

  /**
   * @param {Event} event
   */
  _onFileChange(event) {
    FileInput.createMessage(
        event.target.files[0],
        this._pcc.send.bind(this._pcc),
        this._onUploadFile.bind(this),
    );
  }

  /**
   * @param {{name: string, content: string}} message
   * @private
   */
  _onTextMessage(message) {
    const messageBox = this._drawMessage(message.content, false, message.name);
    this._drawMessageBox(messageBox);
  }


  /**
   * @param {{name: string, chunk: Chunk}} event
   * @private
   */
  _onFileMessageUpload(event) {
    const chunk = event.chunk;
    let rfm = this._recivedFileMessages[chunk.fileId];
    if (rfm) {
      rfm.add(chunk);
    } else {
      rfm = new FileMessage();
      const fileBox = this._drawFileMessage(rfm, false, event.name);
      this._drawMessageBox(fileBox);
      rfm.add(chunk);
      this._recivedFileMessages[rfm.id] = rfm;
    }
  }

  /**
   * @param  {FileMessage} rfm
   * @private
   */
  _onUploadFile(rfm) {
    const fileBox = this._drawFileMessage(rfm, true, 'Я');
    this._drawMessageBox(fileBox);
  }

  /**
   * @param {Element} elem
   */
  _drawMessageBox(elem) {
    if (this._messagesEl.childElementCount > 0) {
      this._messagesEl.appendChild(elem);
    } else {
      this._messagesEl.insertBefore(elem, this._messagesEl.childNodes[0]);
    }
  }

  /**
   * @param {string} name
   * @return {Element}
   */
  _drawUser(name) {
    const div = document.createElement('div');
    div.textContent = name;

    return div;
  };


  /**
   * @param {string} text
   * @return {Element}
   */
  _drawInfoMessage(text) {
    const div = document.createElement('div');
    div.classList.add('message-info');
    div.textContent = text;

    return div;
  };


  /**
   * @param {string} text
   * @param {boolean} toggleMy
   * @param {string} name
   * @return {Element}
   */
  _drawMessage(text, toggleMy, name) {
    const messageBox = document.createElement('div');
    const div = document.createElement('div');

    const spanUserName = document.createElement('span');
    const spanText = document.createElement('span');

    if (toggleMy) {
      messageBox.classList.add('message-my');
    } else {
      messageBox.classList.add('message-user');
    }

    spanUserName.classList.add('user-name');
    spanUserName.textContent = name;

    spanText.classList.add('message-text');
    spanText.textContent = text;

    div.classList.add('wrap');
    div.appendChild(spanUserName);

    messageBox.appendChild(div);
    messageBox.appendChild(spanText);

    return messageBox;
  };


  /**
   * @param {object} file
   * @param {boolean} toggleMy
   * @param {string} name
   * @return {Element}
   */
  _drawFileMessage(file, toggleMy, name) {
    const messageBox = document.createElement('div');
    const fileName = document.createElement('span');
    const progress = document.createElement('div');
    const spanUserName = document.createElement('div');
    const div = document.createElement('div');

    if (toggleMy) {
      messageBox.classList.add('message-my');
    } else {
      messageBox.classList.add('message-user');
    }

    spanUserName.classList.add('user-name');
    spanUserName.textContent = name;

    progress.classList.add('file-progress');

    fileName.classList.add('message-text');
    fileName.textContent = 'File';

    div.classList.add('wrap');
    div.appendChild(spanUserName);

    messageBox.appendChild(div);
    messageBox.appendChild(fileName);
    messageBox.appendChild(progress);

    const onProgress = (p) => {
      progress.style.width = p + '%';
    };

    const onLoad = (blob) => {
      const url = (window.URL || window.webkitURL).createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.download = file.name;
      link.textContent = 'Save';
      messageBox.appendChild(link);
    };

    const onMetaLoad = () => {
      fileName.textContent = file.name;
    };

    file.onProgress = onProgress;
    file.onLoad = onLoad;
    file.onMetaLoad = onMetaLoad;

    return messageBox;
  };
}

/**
 * @typedef {{
 *     selectors: Chat.Selectors,
 *     collection: PeerConnectionCollection
 * }}
 */
Chat.Dependencies;

/**
 * @typedef {{
 *     chat: string,
 *     sendButton: string,
 *     message: string,
 *     file: string,
 *     messages: string,
 *     userList: string
 * }}
 */
Chat.Selectors;
