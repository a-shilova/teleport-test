/**
 * Created by gaika on 02.10.2017.
 */

/**
 *
 * @param {Socket} ioConnection
 * @param {PeerConnectionCollection} peerConnectionCollection
 * @constructor
 */
SignalConnection = function(ioConnection, peerConnectionCollection) {
    this._ioConnection = ioConnection;
    this._peerConnCollection = peerConnectionCollection;
    this._subscribeToEvents();
};


/**
 * @param {SignalConnection.EVENT_TYPE} event
 * @param {Object} data
 */
SignalConnection.prototype.send = function(event, data) {
    this._ioConnection.emit(event, JSON.stringify(data));
};


/**
 *
 * @private
 */
SignalConnection.prototype._subscribeToEvents = function() {
    this._ioConnection.on(SignalConnection.EVENT_TYPE.LOGIN, this._onLogin.bind(this));
    this._ioConnection.on(SignalConnection.EVENT_TYPE.NEW, this._onNewConnection.bind(this));
    this._ioConnection.on(SignalConnection.EVENT_TYPE.OFFER, this._onNewOffer.bind(this));
    this._ioConnection.on(SignalConnection.EVENT_TYPE.ANSWER, this._onAnswer.bind(this));
    this._ioConnection.on(SignalConnection.EVENT_TYPE.CANDIDATE, this._onCandidate.bind(this));
    this._ioConnection.on(SignalConnection.EVENT_TYPE.LEAVE, this._onLeave.bind(this));
};


/**
 *
 * @private
 */
SignalConnection.prototype._onLogin = () => {
    console.log('login');
};


/**
 * @param {{connectionId: string, name: string}} data
 * @private
 */
SignalConnection.prototype._onNewConnection = function(data) {
    console.log('onnewconn');
    data['forceChannels'] = true;
    const peerConnection = this._peerConnCollection.create(data);
    const rtcConnection = peerConnection.getConnection();
    rtcConnection.onicecandidate = event => {
        if (event.candidate) {
            this.send(SignalConnection.EVENT_TYPE.CANDIDATE, {
                candidate: event.candidate,
                connectionId: peerConnection.id
            });
        }
    };
    rtcConnection.createOffer(offer => {
        this.send(SignalConnection.EVENT_TYPE.OFFER, {
            offer: offer,
            connectionId: peerConnection.id
        });
        rtcConnection.setLocalDescription(offer);
    }, error => {
        console.log(error);
    })
};


/**
 * @param {{connectionId: string, name: string, offer: string}} data
 * @private
 */
SignalConnection.prototype._onNewOffer = function(data) {
    console.log('new offer');
    const peerConnection = this._peerConnCollection.create(data);
    const rtcConnection = peerConnection.getConnection();
    rtcConnection.onicecandidate = event => {
        if (event.candidate) {
            this.send(SignalConnection.EVENT_TYPE.CANDIDATE, {
                candidate: event.candidate,
                connectionId: peerConnection.id
            });
        }
    };
    rtcConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
    rtcConnection.createAnswer(answer => {
        rtcConnection.setLocalDescription(answer);
        this.send(SignalConnection.EVENT_TYPE.ANSWER, {
            answer: answer,
            connectionId: peerConnection.id
        })
    }, err => {
        console.log(err);
    });
};


/**
 * @param {{connectionId: string, answer: string}} data
 * @private
 */
SignalConnection.prototype._onAnswer = function(data) {
    const peerConnection = this._peerConnCollection.getById(data.connectionId);
    console.log('answer');
    if (peerConnection) {
        peerConnection.getConnection().setRemoteDescription(new RTCSessionDescription(data.answer));
    }
};


/**
 * @param {{connectionId: string, candidate: string}} data
 * @private
 */
SignalConnection.prototype._onCandidate = function(data) {
    console.log('candidate');
    const peerConnection = this._peerConnCollection.getById(data.connectionId);
    if (peerConnection) {
        peerConnection.getConnection().addIceCandidate(new RTCIceCandidate(data.candidate));
    }
};


/**
 * @param {{connectionId: string}} data
 * @private
 */
SignalConnection.prototype._onLeave = function(data) {
    console.log('leave');
    this._peerConnCollection.deleteById(data.connectionId);
};


/**
 * @type {Socket}
 */
SignalConnection.prototype._ioConnection;


/**
 * @type {PeerConnectionCollection}
 */
SignalConnection.prototype._peerConnCollection;


/**
 * @enum {string}
 */
SignalConnection.EVENT_TYPE = {
    LOGIN: 'login',
    NEW: 'new',
    OFFER: 'offer',
    ANSWER: 'answer',
    CANDIDATE: 'candidate',
    LEAVE: 'leave'
};