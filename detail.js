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
                    <p>Prénom : ${person.prenom}</p>
                    <p>Date de Naissance  : ${person.date_naissance}</p>
                `;
            } else {
                personDetails.textContent = 'Personne non trouvée';
            }
        })
        .catch(error => console.error('Erreur lors du chargement des données :', error));
};

document.addEventListener('DOMContentLoaded', () => {
    const personDetails = document.getElementById('person-details');

    // Extraire l'identifiant de la personne depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const personId = urlParams.get('id');

    // Charger les données depuis le fichier JSON
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // Trouver la personne correspondante
            const person = data.find(person => person.id == personId);

            if (person) {
                const detailsList = document.createElement('ul');

                // Ajouter le nom et prénom
                const nameItem = document.createElement('li');
                nameItem.textContent = `Nom: ${person.nom}, Prénom: ${person.prenom}`;
                detailsList.appendChild(nameItem);

                // Ajouter la date de naissance
                const birthDateItem = document.createElement('li');
                birthDateItem.textContent = `Date de Naissance: ${person.date_naissance}`;
                detailsList.appendChild(birthDateItem);

                // Ajouter le lieu de naissance
                const birthPlaceItem = document.createElement('li');
                birthPlaceItem.textContent = `Lieu de Naissance: ${person.lieu_naissance}`;
                detailsList.appendChild(birthPlaceItem);

                // Ajouter la date de décès si elle n'est pas nulle
                if (person.date_deces !== null) {
                    const deathDateItem = document.createElement('li');
                    deathDateItem.textContent = `Date de Décès: ${person.date_deces}`;
                    detailsList.appendChild(deathDateItem);
                }

                personDetails.appendChild(detailsList);
            } else {
                personDetails.textContent = 'Personne introuvable.';
            }
        })
        .catch(error => console.error('Erreur lors du chargement des données JSON:', error));
});

