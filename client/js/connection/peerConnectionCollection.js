/**
 * Created by gaika on 02.10.2017.
 */

/**
 * @class {PeerConnectionCollection}
 */
class PeerConnectionCollection {
  /**
   * @constructor
   */
  constructor() {
    /**
     * @type {Object<string, PeerConnection>}
     * @protected
     */
    this._collection = {};
  }

  /**
   * @param {PeerConnection.Input} data
   * @return {PeerConnection}
   */
  create(data) {
    const peerConn = new PeerConnection(data);
    this.add(peerConn);
    this.onNewPeerConnection(peerConn);
    return peerConn;
  }

  /**
   * @param {PeerConnection} peerConn
   */
  add(peerConn) {
    this._collection[peerConn.id] = peerConn;
  }

  /**
   * @return {Array<string>}
   */
  getNames() {
    return Object.keys(this._collection).map((key) => {
      return this._collection[key].name;
    });
  }

  /**
   * @param {string} id
   * @return {?PeerConnection}
   */
  getById(id) {
    return this._collection[id] || null;
  }

  /**
   * @param {string} id
   */
  deleteById(id) {
    const peerConnection = this.getById(id);
    if (peerConnection) {
      peerConnection.close();
      delete this._collection[id];
      this.onDeletePeerConnection(peerConnection.name);
    }
  }

  /**
   * @param {{type: string, content: string}} message
   */
  send(message) {
    Object.keys(this._collection).forEach((key) => {
      this._collection[key].send(message);
    });
  }

  /**
   * @param {PeerConnection} connection
   */
  onNewPeerConnection(connection) {}

  /**
   * @param {string} name
   */
  onDeletePeerConnection(name) {}
}
PeerConnectionCollection;
