const pageCourrante = window.location.pathname;
const liensMenu = document.querySelectorAll('nav a');

liensMenu.forEach(lien => {
    if(currentUrl.includes(lien.getAttribute('href')) {
        lien.classList.add('lienActif')
    }
    
});