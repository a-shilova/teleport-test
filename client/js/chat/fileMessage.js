/**
 * Created by gaika on 02.10.2017.
 */


/**
 * @constructor
 */
FileMessage = function() {
    this.data = [];
};


/**
 * @param {Chunk} chunk
 */
FileMessage.prototype.add = function(chunk) {
    if (this.data.length === 0) {
        this.onStartLoading();
    }
    if (chunk.currentChunk === 1) {
        this.chunkCount = chunk.chunkCount;
        this.fileType = chunk.fileType;
        this.name = chunk.name;
        this.extension = chunk.extension;
        this.id = chunk.fileId;
        this.onMetaLoad();
    }
    this.data[chunk.currentChunk] = chunk.data;

    this.onProgress(chunk.currentChunk / this.chunkCount * 100);

    if (chunk.currentChunk === this.chunkCount) {
        this.onLoad(this._convertToBlob());
    }
};


/**
 *
 */
FileMessage.prototype.onStartLoading = function() {};


/**
 *
 */
FileMessage.prototype.onMetaLoad = function() {};


/**
 *
 */
FileMessage.prototype.onProgress = function() {};


/**
 *
 */
FileMessage.prototype.onStartLoading = function() {};


/**
 *
 */
FileMessage.prototype.onMetaLoad = function() {};


/**
 *
 */
FileMessage.prototype.onLoad = function() {};


/**
 * @return {*}
 * @private
 */
FileMessage.prototype._convertToBlob = function() {
    var binary = atob(this.data.join(''));
    var array = [];
    for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }

    return new Blob([new Uint8Array(array)], { type: this.fileType });
};


