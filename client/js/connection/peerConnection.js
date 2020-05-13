/**
 * Created by gaika on 02.10.2017.
 */


const RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection;


/**
 * @param {{connectionId: string, name: string, forceChannels: boolean|undefined}} data
 */
PeerConnection = function(data) {
    this.id = data.connectionId;
    this.name = data.name;
    this._rtcConn = new RTCPeerConnection(PeerConnection.CONFIG);
    this._rtcConn.ondatachannel = event => {
        if (event.channel.label === PeerConnection.CHANNEL_TYPE.FILE) {
            this._createFileChannel(event.channel);
        }
        if (event.channel.label === PeerConnection.CHANNEL_TYPE.TEXT) {
            this._createTextChannel(event.channel);
        }
    };
    if (data.forceChannels) {
        this._createFileChannel();
        this._createTextChannel();
    }
};


PeerConnection.prototype.getConnection = function() {
    return this._rtcConn;
};


PeerConnection.prototype.close = function() {
    this._rtcConn.close();
};


/**
 * @param {{type: string, content: string}} message
 */
PeerConnection.prototype.send = function(message) {
    if (message.type === 'text') {
        this._textChannel.send(message.content);
    }
    if (message.type === 'file') {
        this._fileChannel.send(JSON.stringify(message.content));
    }
};



/**
 * @param {RTCDataChannel=} opt_channel
 * @private
 */
PeerConnection.prototype._createTextChannel = function(opt_channel) {
    this._textChannel = opt_channel || this._rtcConn.createDataChannel(PeerConnection.CHANNEL_TYPE.TEXT);

    this._textChannel.onopen = event => {
        console.log('open channel');
    };

    this._textChannel.onerror = error => {
        console.log(error);
    };

    this._textChannel.onmessage = event => {
        this.onTextMessage({
            name: this.name,
            content: event.data
        });
    };

    this._textChannel.onclose = () => {
        console.log('channelClose');
    };
};


/**
 * @param {RTCDataChannel=} opt_channel
 * @private
 */
PeerConnection.prototype._createFileChannel = function(opt_channel) {
    this._fileChannel = opt_channel || this._rtcConn.createDataChannel(PeerConnection.CHANNEL_TYPE.FILE);

    this._fileChannel.onopen = event => {
        console.log('open channel');
    };

    this._fileChannel.onerror = error => {
        console.log(error);
    };

    this._fileChannel.onmessage = event => {
        const chunk = new Chunk(event.data);
        this.onFileMessage({
            name: this.name,
            chunk: chunk
        });
    };

    this._fileChannel.onclose = () => {
        console.log('channelClose');
    };
};


/**
 *
 * @param {{name: string, content: string}} message
 */
PeerConnection.prototype.onTextMessage = message => {};


/**
 *
 * @param {{name: string, chunk: Chunk}} message
 */
PeerConnection.prototype.onFileMessage = message => {};


/**
 * @type {{iceServers: *[]}}
 */
// PeerConnection.CONFIG = {
//     iceServers: [{url:'stun:stun01.sipphone.com'},
//         {url:'stun:stun.ekiga.net'},
//         {url:'stun:stun.fwdnet.net'},
//         {url:'stun:stun.ideasip.com'},
//         {url:'stun:stun.iptel.org'},
//         {url:'stun:stun.rixtelecom.se'},
//         {url:'stun:stun.schlund.de'},
//         {url:'stun:stun.l.google.com:19302'},
//         {url:'stun:stun1.l.google.com:19302'},
//         {url:'stun:stun2.l.google.com:19302'},
//         {url:'stun:stun3.l.google.com:19302'},
//         {url:'stun:stun4.l.google.com:19302'},
//         {url:'stun:stunserver.org'},
//         {url:'stun:stun.softjoys.com'},
//         {url:'stun:stun.voiparound.com'},
//         {url:'stun:stun.voipbuster.com'},
//         {url:'stun:stun.voipstunt.com'},
//         {url:'stun:stun.voxgratia.org'},
//         {url:'stun:stun.xten.com'},
//         {
//             url: 'turn:numb.viagenie.ca',
//             credential: 'muazkh',
//             username: 'webrtc@live.com'
//         },
//         {
//             url: 'turn:192.158.29.39:3478?transport=udp',
//             credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
//             username: '28224511:1379330808'
//         },
//         {
//             url: 'turn:192.158.29.39:3478?transport=tcp',
//             credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
//             username: '28224511:1379330808'
//         }]
// };


PeerConnection.CONFIG = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302'
        },
        {
            urls: 'stun:global.stun.twilio.com:3478?transport=udp'
        }
    ]
};


/**
 * @type {string}
 */
PeerConnection.prototype.id;


/**
 * @type {string}
 */
PeerConnection.prototype.name;


/**
 * @type {RTCPeerConnection}
 */
PeerConnection.prototype._rtcConn;


/**
 * @type {string}
 */
PeerConnection.prototype._textChannel;


/**
 * @type {string}
 */
PeerConnection.prototype._fileChannel;


/**
 * @enum {string}
 */
PeerConnection.CHANNEL_TYPE = {
    TEXT: 'text',
    FILE: 'file'
};