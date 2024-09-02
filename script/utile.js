const pageCourrante = window.location.pathname;
const liensMenu = document.querySelectorAll('nav a');

liensMenu.forEach(lien => {
    if(lien.getAttribute('href') === pageCourrante) {
        lien.classList.add('lienActif')
    }
    
});