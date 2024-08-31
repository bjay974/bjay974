document.addEventListener('DOMContentLoaded', function() {
    var audio = document.getElementById('audioPlayer');
    audio.volume = 0.8;  // Ajuster le volume

    // Définir le temps de départ en secondes
    var startTime = 18;
    
    // Lancer la musique à la position startTime
    audio.addEventListener('loadedmetadata', function() {
        audio.currentTime = startTime;  // Positionner à 18 secondes
        audio.play();  // Démarrer la lecture
    });
});

