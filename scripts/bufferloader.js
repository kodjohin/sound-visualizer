
function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = [];
    this.loadCount = 0;
}

BufferLoader.prototype = {

    constructor:BufferLoader,

    loadBuffer :function(url, index) {
        var loader = this;

        // Load buffer asynchronously
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        request.onload = function() {
            // Asynchronously decode the audio file data in request.response
            loader.context.decodeAudioData(
                request.response,
                function(buffer) {
                    if (!buffer) {
                        alert('error decoding file data: ' + url);
                        return;
                    }
                    loader.bufferList[index] = buffer;
                    if (++loader.loadCount == loader.urlList.length){
                        loader.onload(loader.bufferList);
                        WebAudio.source.buffer = buffer;
                        document.dispatchEvent(new Event('bufferLoaded'));
                    }
                },
                function(error) {
                    console.error('decodeAudioData error', error);
                }
            );
        }

        request.onerror = function() {
            alert('BufferLoader: XHR error');
        }
        request.send();
    },

    load :function() {
        for (var i = 0; i < this.urlList.length; ++i)
            this.loadBuffer(this.urlList[i], i);
    }
}

function loadSounds(obj, soundMap, callback) {
    // Array-ify
    var names = [];
    var paths = [];
    for (var name in soundMap) {
        var path = soundMap[name];
        names.push(name);
        paths.push(path);
    }
    var bufferLoader = new BufferLoader(WebAudio.ctx, paths, function(bufferList) {
        for (var i = 0; i < bufferList.length; i++) {
            var buffer = bufferList[i];
            var name = names[i];
            obj[name] = buffer;
        }
        if (callback) {
            callback();
        }
    });
    bufferLoader.load();
}


/*
loadSounds(this, {
    buffer: 'sounds/bofas.mp3'
});*/
