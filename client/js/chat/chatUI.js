/**
 * Created by gaika on 02.10.2017.
 */


/**
 * @param {string} name
 * @return {Element}
 */
drawUser = name => {
    const div = document.createElement('div');
    div.textContent = name;

    return div;
};


/**
 * @param {string} text
 * @return {Element}
 */
drawInfoMessage = text => {
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
drawMessage = (text, toggleMy, name) => {
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

drawFileMessage = (file, toggleMy, name) => {
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

    function onProgress(p) {
        progress.style.width = p + '%';
    }

    function onLoad(blob) {
        const url = (window.URL || window.webkitURL).createObjectURL(blob);
        const link = document.createElement('a');
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