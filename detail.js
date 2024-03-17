window.onload = function() {
    // Récupérer l'ID de la personne à partir de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const personId = urlParams.get('id');

    // Charger les données JSON
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // Trouver la personne correspondante
            const person = data.find(p => p.id === parseInt(personId));

            // Afficher les détails de la personne
            const personDetails = document.getElementById('person-details');
            if (person) {
                personDetails.innerHTML = `
                    <p>Nom : ${person.nom}</p>
                    <p>Prénom : ${person.prénom}</p>
                    <p>Date de Naissance  : ${person.date_naissance}</p>
                `;
            } else {
                personDetails.textContent = 'Personne non trouvée';
            }
        })
        .catch(error => console.error('Erreur lors du chargement des données :', error));
};
