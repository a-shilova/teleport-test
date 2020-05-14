/**
 * Created by gaika on 02.10.2017.
 */

/**
 * @class {FileMessage}
 */
class FileMessage {
  /**
   * @constructor
   */
  constructor() {
    this.data = [];
  }

  /**
   * @param {Chunk} chunk
   */
  add(chunk) {
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
  onStartLoading() {};

  /**
   *
   */
  onMetaLoad() {};

  /**
   *
   */
  onProgress() {};

  /**
   *
   */
  onLoad() {}

  /**
   * @return {*}
   * @private
   */
  _convertToBlob() {
    const binary = atob(this.data.join(''));
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }

    return new Blob([new Uint8Array(array)], {type: this.fileType});
  }
}
FileMessage;
