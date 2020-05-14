/**
 * Created by gaika on 02.10.2017.
 */

/**
 * @class {SignalConnection}
 */
class SignalConnection {
  /**
   * @param {Socket} ioConnection
   * @param {PeerConnectionCollection} peerConnectionCollection
   * @constructor
   */
  constructor(ioConnection, peerConnectionCollection) {
    /**
     * @type {Socket}
     */
    this._ioConnection = ioConnection;

    /**
     * @type {PeerConnectionCollection}
     */
    this._peerConnCollection = peerConnectionCollection;

    this._subscribeToEvents();
  };

  /**
   * @param {SignalConnection.EVENT_TYPE} event
   * @param {Object} data
   */
  send(event, data) {
    this._ioConnection.emit(event, JSON.stringify(data));
  }

  /**
   * @private
   */
  _subscribeToEvents() {
    this._ioConnection
        .on(SignalConnection.EVENT_TYPE.LOGIN, this._onLogin.bind(this));
    this._ioConnection
        .on(SignalConnection.EVENT_TYPE.NEW, this._onNewConnection.bind(this));
    this._ioConnection
        .on(SignalConnection.EVENT_TYPE.OFFER, this._onNewOffer.bind(this));
    this._ioConnection
        .on(SignalConnection.EVENT_TYPE.ANSWER, this._onAnswer.bind(this));
    this._ioConnection
        .on(
            SignalConnection.EVENT_TYPE.CANDIDATE,
            this._onCandidate.bind(this),
        );
    this._ioConnection
        .on(SignalConnection.EVENT_TYPE.LEAVE, this._onLeave.bind(this));
  };

  /**
   *
   * @private
   */
  _onLogin() {
    console.log('login');
  };

  /**
   * @param {{connectionId: string, name: string}} data
   * @private
   */
  _onNewConnection(data) {
    console.log('onnewconn');
    data['forceChannels'] = true;
    const peerConnection = this._peerConnCollection.create(data);
    const rtcConnection = peerConnection.getConnection();
    rtcConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.send(SignalConnection.EVENT_TYPE.CANDIDATE, {
          candidate: event.candidate,
          connectionId: peerConnection.id,
        });
      }
    };
    rtcConnection.createOffer((offer) => {
      this.send(SignalConnection.EVENT_TYPE.OFFER, {
        offer: offer,
        connectionId: peerConnection.id,
      });
      rtcConnection.setLocalDescription(offer);
    }, (error) => {
      console.log(error);
    });
  };

  /**
   * @param {{connectionId: string, name: string, offer: string}} data
   * @private
   */
  _onNewOffer(data) {
    console.log('new offer');
    const peerConnection = this._peerConnCollection.create(data);
    const rtcConnection = peerConnection.getConnection();
    rtcConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.send(SignalConnection.EVENT_TYPE.CANDIDATE, {
          candidate: event.candidate,
          connectionId: peerConnection.id,
        });
      }
    };
    rtcConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
    rtcConnection.createAnswer((answer) => {
      rtcConnection.setLocalDescription(answer);
      this.send(SignalConnection.EVENT_TYPE.ANSWER, {
        answer: answer,
        connectionId: peerConnection.id,
      });
    }, (err) => {
      console.log(err);
    });
  };


  /**
   * @param {{connectionId: string, answer: string}} data
   * @private
   */
  _onAnswer(data) {
    const peerConnection = this._peerConnCollection.getById(data.connectionId);
    console.log('answer');
    if (peerConnection) {
      peerConnection
          .getConnection()
          .setRemoteDescription(new RTCSessionDescription(data.answer));
    }
  };

  /**
   * @param {{connectionId: string, candidate: string}} data
   * @private
   */
  _onCandidate(data) {
    console.log('candidate');
    const peerConnection = this._peerConnCollection.getById(data.connectionId);
    if (peerConnection) {
      peerConnection
          .getConnection()
          .addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  };


  /**
   * @param {{connectionId: string}} data
   * @private
   */
  _onLeave(data) {
    console.log('leave');
    this._peerConnCollection.deleteById(data.connectionId);
  };
}

/**
 * @enum {string}
 */
SignalConnection.EVENT_TYPE = {
  LOGIN: 'login',
  NEW: 'new',
  OFFER: 'offer',
  ANSWER: 'answer',
  CANDIDATE: 'candidate',
  LEAVE: 'leave',
};
