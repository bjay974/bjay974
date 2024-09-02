const urlCourrante = window.location.pathname;
const liensMenu = document.querySelectorAll('nav a');

liensMenu.forEach(lien => {
    const lienChemin = new URL(lien.href).pathname.split('/')/pop();
    const pageCourrante = urlCourrante.split('/').pop();
    if(lienChemin === pageCourrante) {
        lien.classList.add('lienActif')
    }
    
});