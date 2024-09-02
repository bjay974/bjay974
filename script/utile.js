const pageCourrante = window.location.href;
const liensMenu = document.querySelectorAll('nav a');

liensMenu.forEach(lien => {
    if(pageCourrante.includes(lien.getAttribute('href'))) {
        lien.classList.add('lienActif')
    }
    
});