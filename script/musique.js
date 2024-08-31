document.addEventListener('DOMContentLoaded', function() {
    var audio = document.getElementById('audioPlayer');
    var playButton = document.getElementById('playButton');
    audio.volume = 0.8;  // Ajuster le volume

    // Définir le temps de départ en secondes
    var startTime = 18;
    
    // Lancer la musique à la position startTime
    playButton.addEventListener('click', function() {
        audio.currentTime = startTime;  // Positionner à 18 secondes
        audio.play();  // Démarrer la lecture
        playButton.style.display = 'none';  // Cacher le bouton après le démarrage
    });
});

