document.addEventListener('DOMContentLoaded', function() {
    var audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.volume = 0.8;
    // start de la musique( en secondes)
    var startTime = 18;
    
    // Lance la musique 
    audioPlayer.addEventListener('loadedmetadata', function() {
        audioPlayer.currentTime = startTime;
    });

    // lancement auto
    audioPlayer.play();

});
