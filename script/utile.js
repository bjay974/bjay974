const pageCourrante = window.location.href;
cont liensMenu = document.querySelectoAll('nav a');

liensMenu.forEach(lien => {
    if(pageCourrante.includes(lien.getAttribute('href'))) {
        lien.classList.add('lienActif')
    }
    
});