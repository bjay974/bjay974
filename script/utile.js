const urlCourrante = window.location.pathname;
const liensMenu = document.querySelectorAll('nav a');

liensMenu.forEach(lien => {
    const lienChemin = new URL(lien.href).pathname.split('/').pop();
    const pageCourranteDEb = urlCourrante.split('/').pop();
    const pageCourrante = pageCourranteDEb.replace(/[0-9]/g,"");
    if(lienChemin === pageCourrante) {
        lien.classList.add('actif')
    }
});