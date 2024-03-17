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
            const person = data.find(p => p.id === parseInt(personId));
            const personDetails = document.getElementById('person-details');
            if (person) {
                const detailsList = document.createElement('ul');

                // Ajouter le nom et prénom
                const nameItem = document.createElement('li');
                nameItem.textContent = `Nom: ${person.nom}, Prénom: ${person.prenom}`;
                detailsList.appendChild(nameItem);

                // Ajouter la date de naissance
                const birthDateItem = document.createElement('li');
                birthDateItem.textContent = `Naissance: ${person.date_naissance} à ${person.lieu_naissance} `;
                detailsList.appendChild(birthDateItem);

              
                // Ajouter la date de mariage et le nom si la date n'est pas nulle
                if (person.date_mariage !== null) {
                    const weddingDateItem = document.createElement('li');
                    weddingDateItem.textContent = `Mariage: ${person.date_mariage} à ${person.lieu_mariage} `;
                    detailsList.appendChild(weddingDateItem);
                    const weddingNameItem = document.createElement('li');
                    weddingNameItem.textContent = `Nom d'épouse: ${person.nom_epouse}`;
                    detailsList.appendChild(weddingNameItem);
                }
                
                // Ajouter la date de décès si elle n'est pas nulle
                if (person.date_deces !== null) {
                    const deathDateItem = document.createElement('li');
                    deathDateItem.textContent = `Décès: ${person.date_deces} à ${person.lieu_deces} `;
                    detailsList.appendChild(deathDateItem);
                }



                
                personDetails.appendChild(detailsList);

            } else {
                personDetails.textContent = 'Personne introuvable.';
            }
        })
        .catch(error => console.error('Erreur lors du chargement des données JSON:', error));
});
