if(navigator.userAgent.match(/Opera|OPR\//) ? true : false){
    loadSounds(this, {
        buffer: 'sounds/bofas.wav'
    });
}
else{
    loadSounds(this, {
        buffer: 'sounds/edijaeoy.mp3'
    });
}

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var loader = document.querySelector('.loader');
var cvs = document.querySelector('canvas')
var drawContext = cvs.getContext('2d');
var alpha = 0;

cvs.style.visibility = 'hidden';

WebAudio.SMOOTHING = .5;

function draw(){
    cvs.width = WIDTH;
    cvs.height = HEIGHT;
    
    loader.style.opacity -= .1;
    alpha += .01;
    if(alpha > 1){
        alpha = 1;
    }
    
    WebAudio.frequencyData;
    
    // Draw the frequency domain chart.
    for (var i = 0; i < WebAudio.frequencyBinCount; i++) {
        var value = WebAudio.freqs[i];
        var percent = value / 256;
        var height = HEIGHT * percent;
        var offset = HEIGHT - height - 1;
        drawContext.strokeStyle = 'white';
        drawContext.globalAlpha = alpha;
        drawContext.beginPath();
        drawContext.lineWidth = .5;

        drawContext.arc((WIDTH/i*4), HEIGHT/2, offset*2/i, 0, Math.PI*2);
        drawContext.arc((WIDTH/i*4), HEIGHT/2, offset/i, 0, Math.PI*2);
        drawContext.arc((WIDTH/i*4), HEIGHT/2, offset *.5/i, 0, Math.PI*2);
        drawContext.arc((WIDTH/i*4), HEIGHT/2, offset *.25/i, 0, Math.PI*2);

        drawContext.stroke();
    }
    if(WebAudio.isPlaying){
        requestAnimFrame(draw);
    }
}



//region Handlers

document.addEventListener('bufferLoaded', onSoundLoaded);

function onSoundLoaded(){
    document.removeEventListener('bufferLoaded',onSoundLoaded);
    WebAudio.source.start(0);
    WebAudio.isPlaying = true;
    draw();
    cvs.style.visibility = 'visible';
    cvs.addEventListener('mousedown', onDocMouseDown);
}

WebAudio.source.onended = onEnded;
function onEnded() {
    WebAudio.isFinished = true;
    console.log('playback finished');
    WebAudio.isPlaying = false;
    cvs.style.visibility = 'hidden';
    cvs.removeEventListener('mousedown', onDocMouseDown);
}

window.onresize = function(){
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
}

function onDocMouseDown (){
    if(WebAudio.isPlaying){
        WebAudio.source.disconnect();
    }
    else{
        WebAudio.source.connect(WebAudio.analyser);
        requestAnimFrame(draw);
    }
    WebAudio.isPlaying = !WebAudio.isPlaying;
}

//endregion
