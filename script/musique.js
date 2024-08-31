document.addEventListener('DOMContentLoaded', function() {
    var audio = document.getElementById('audioPlayer');
    audioPlayer.volume = 0.8;
    // start de la musique( en secondes)
    var startTime = 18;
    
    // Lance la musique 
    audio.addEventListener('loadedmetadata', function() {
        audioPlayer.currentTime = startTime;
    });

    // lancement auto
    audio.play();
});

