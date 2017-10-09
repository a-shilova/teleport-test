/**
 * Created by gaika on 02.10.2017.
 */


/**
 *
 * @constructor
 */
PeerConnectionCollection = function() {
    this._collection = {};
};


/**
 *
 * @param data
 */
PeerConnectionCollection.prototype.create = function(data) {
    var peerConn = new PeerConnection(data);
    this.add(peerConn);
    this.onNewPeerConnection(peerConn);
    return peerConn;
};


/**
* @param {PeerConnection} peerConn
*/
PeerConnectionCollection.prototype.add = function(peerConn) {
    this._collection[peerConn.id] = peerConn;
};


/**
 * @return {Array<string>}
 */
PeerConnectionCollection.prototype.getNames = function() {
    return Object.keys(this._collection).map(function(key) {
        return this._collection[key].name;
    }, this);
};


/**
 * @param {string} id
 * @return {?PeerConnection}
 */
PeerConnectionCollection.prototype.getById = function(id) {
    return this._collection[id] || null;
};


/**
 * @param {string} id
 */
PeerConnectionCollection.prototype.deleteById = function(id) {
    var peerConnection = this.getById(id);
    if (peerConnection) {
        peerConnection.close();
        delete this._collection[id];
        this.onDeletePeerConnection(peerConnection.name);
    }
};


/**
 * @param {{type: string, content: string}} message
 */
PeerConnectionCollection.prototype.send = function(message) {
    Object.keys(this._collection).forEach(function(key) {
        this._collection[key].send(message);
    }.bind(this));
};


/**
 * @param {PeerConnection} connection
 */
PeerConnectionCollection.prototype.onNewPeerConnection = function(connection) {};


/**
 * @param {string} name
 */
PeerConnectionCollection.prototype.onDeletePeerConnection = function(name) {};


/**
 * @type {Object<string, PeerConnection>}
 * @protected
 */
PeerConnectionCollection.prototype._collection;