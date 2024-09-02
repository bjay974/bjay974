const pageCourrante = window.location.pathname;
const liensMenu = document.querySelectorAll('nav a');

liensMenu.forEach(lien => {
    if(lien.includes(pageCourrante.getAttribute('href'))) {
        lien.classList.add('lienActif')
    }
    
});