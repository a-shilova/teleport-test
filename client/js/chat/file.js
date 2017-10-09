/**
 * Created by gaika on 02.10.2017.
 */


/**
 * @param {{type: string, content: string|Chunk}} data
 * @constructor
 */
FileInput = function(data) {
    this.type = data.type;
    this.content = data.content;
};


/**
 * @return {string}
 */
FileInput.generateUuid = function() {
    var s4 = function() {
        return Math.floor(Math.random() * 0x10000).toString(16);
    };

    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
};


/**
 * @param {File} file
 * @param {Function} callback
 * @param {Function} onStart
 */
FileInput.createMessage = function(file, callback, onStart) {
    var count = Math.ceil(file.size / FileInput.CHUNK_SIZE);
    var currentChunk = 0;
    var id = this.generateUuid();
    var fileMessage = new FileMessage();
    onStart(fileMessage);

    var fileRead = function() {
        if (currentChunk < count) {
            var fileReader = new FileReader();
            var part = file.slice(currentChunk * FileInput.CHUNK_SIZE, (currentChunk + 1) * FileInput.CHUNK_SIZE);
            fileReader.onload = function(e) {
                var chunk = new Chunk({
                    chunkCount: count,
                    currentChunk: currentChunk + 1,
                    data: e.target.result.split(',')[1],
                    fileType: file.type,
                    name: file.name,
                    extension: file.name.split('.').pop() || '',
                    fileId: id
                });
                fileMessage.add(chunk);
                var config = {
                    type: 'file',
                    content: chunk
                };
                callback(config);
                currentChunk++;
                fileRead();

            };
            fileReader.readAsDataURL(part);
        }
    };
    fileRead();
};



/**
 * @const {number}
 */
FileInput.CHUNK_SIZE = 15000;