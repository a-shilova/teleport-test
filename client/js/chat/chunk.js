/**
 * Created by gaika on 02.10.2017.
 */



/**
 * @param {string|Object} message
 * @constructor
 */
Chunk = function(message) {
    /** @type {{chunkCount: number, currentChunk: number, data: string, fileType: string, name: string, fileId: string, extension: string}} */
    const data = typeof message === 'string' ? JSON.parse(message) : message;
    this.fileId = data.fileId;
    this.data = data.data;
    this.currentChunk = data.currentChunk;

    this.chunkCount = data.chunkCount;
    this.fileType = data.fileType;
    this.name = data.name;
    this.extension = data.extension;
};