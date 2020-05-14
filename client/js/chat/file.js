/**
 * Created by gaika on 02.10.2017.
 */

/**
 * @class
 */
class FileInput {
  /**
 * @param {FileInput.Deps} data
 * @constructor
 */
  constructor(data) {
    this.type = data.type;
    this.content = data.content;
  };


  /**
     * @return {string}
     */
  generateUuid() {
    const s4 = () => Math.floor(Math.random() * 0x10000).toString(16);

    return s4() + s4() + '-' +
      s4() + '-' + s4() + '-' +
      s4() + '-' +
      s4() + s4() + s4();
  };


  /**
     * @param {File} file
     * @param {Function} callback
     * @param {Function} onStart
     */
  static createMessage(file, callback, onStart) {
    const count = Math.ceil(file.size / FileInput.CHUNK_SIZE);
    let currentChunk = 0;
    const id = this.generateUuid();
    const fileMessage = new FileMessage();
    onStart(fileMessage);

    const fileRead = () => {
      if (currentChunk < count) {
        const fileReader = new FileReader();
        const part = file
            .slice(
                currentChunk * FileInput.CHUNK_SIZE,
                (currentChunk + 1) * FileInput.CHUNK_SIZE,
            );
        fileReader.onload = (e) => {
          const chunk = new Chunk({
            chunkCount: count,
            currentChunk: currentChunk + 1,
            data: e.target.result.split(',')[1],
            fileType: file.type,
            name: file.name,
            extension: file.name.split('.').pop() || '',
            fileId: id,
          });
          fileMessage.add(chunk);
          const config = {
            type: 'file',
            content: chunk,
          };
          callback(config);
          currentChunk++;
          fileRead();
        };
        fileReader.readAsDataURL(part);
      }
    };
    fileRead();
  }
}

/**
 * @const {number}
 */
FileInput.CHUNK_SIZE = 15000;

/**
 * @typedef {{
 *  type: string,
 *  content: string|Chunk
 * }}
 */
FileInput.Deps;
