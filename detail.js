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
                    const deathPlaceItem = document.createElement('li');
                    deathPlaceItem.textContent = `Lieu du Décès: ${person.lieu_deces}`;
                    detailsList.appendChild(deathPlaceItem);
                }

                // Ajouter la date de mariage et le nom si la date n'est pas nulle
                if (person.date_mariage !== null) {
                    const weddingDateItem = document.createElement('li');
                    weddingDateItem.textContent = `Date de Mariage: ${person.date_mariage}`;
                    detailsList.appendChild(weddingDateItem);
                    const weddingPlaceItem = document.createElement('li');
                    weddingPlaceItem.textContent = `Lieu du Mariage: ${person.lieu_mariage}`;
                    detailsList.appendChild(weddingPlaceItem);
                    const weddingNameItem = document.createElement('li');
                    weddingNameItem.textContent = `Nom d'épouse: ${person.nom_epouse}`;
                    detailsList.appendChild(weddingNameItem);
                }

                
                personDetails.appendChild(detailsList);

            } else {
                personDetails.textContent = 'Personne introuvable.';
            }
        })
        .catch(error => console.error('Erreur lors du chargement des données JSON:', error));
});
