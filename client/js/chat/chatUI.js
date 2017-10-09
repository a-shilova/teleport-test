/**
 * Created by gaika on 02.10.2017.
 */


/**
 * @param {string} name
 * @return {Element}
 */
drawUser = function(name) {
    var div = document.createElement('div');
    div.textContent = name;

    return div;
};


/**
 * @param {string} text
 * @return {Element}
 */
drawInfoMessage = function(text) {
    var div = document.createElement('div');
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
drawMessage = function(text, toggleMy, name) {
    var messageBox = document.createElement('div');
    var div = document.createElement('div');

    var spanUserName = document.createElement('span');
    var spanText = document.createElement('span');

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

drawFileMessage = function(file, toggleMy, name) {
    var messageBox = document.createElement('div');
    var fileName = document.createElement('span');
    var progress = document.createElement('div');
    var spanUserName = document.createElement('div');
    var div = document.createElement('div');

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

    function onProgress(p) {
        progress.style.width = p + '%';
    }

    function onLoad(blob) {
        var url = (window.URL || window.webkitURL).createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.download = file.name;
        link.textContent = 'Save';
        messageBox.appendChild(link);

    }

    function onMetaLoad() {
        fileName.textContent = file.name;
    }

    file.onProgress = onProgress;
    file.onLoad = onLoad;
    file.onMetaLoad = onMetaLoad;

    return messageBox;
};