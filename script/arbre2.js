// Fonction pour charger les actes
async function chargerPiecesArchives() {
    const detailsList = document.getElementById('archive-details'); // L'élément où les pièces seront affichées

    // Tableau des noms de fichiers
    const nomsFichiers = Array.from({ length: 23 }, (_, i) => {
        const index = i + 1;
        const numeroPiece = index.toString().padStart(4, '0'); // Formatage du numéro de pièce
        return `102_600_345_BETSMAN_${numeroPiece}.jpg`;
    });

    // Parcourir les noms de fichiers et créer les liens
    for (let i = 0; i < nomsFichiers.length; i++) {
        const nomFichier = nomsFichiers[i];
        const lienTexte = `Pièce_${i + 1}`; // Nom du lien à afficher
        const fichierURL = `../data/particulier/${nomFichier}`; // URL du fichier à charger

        // Création de l'élément lien
        const lienPiece = document.createElement('a');
        lienPiece.classList.add('lienFichier');
        lienPiece.textContent = lienTexte;
        lienPiece.href = fichierURL;

        // Création de l'élément colonne pour chaque lien
        const colonnePiece = document.createElement('div');
        colonnePiece.classList.add('colonnePiece');
        colonnePiece.appendChild(lienPiece);

        // Ajouter la colonne à la liste des détails
        detailsList.appendChild(colonnePiece);
    }
}

// Appeler la fonction pour charger les pièces d'archives au chargement de la page
window.addEventListener('DOMContentLoaded', chargerPiecesArchives);
