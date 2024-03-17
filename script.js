// Récupérer la liste des personnes à partir du fichier JSON
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        const personList = document.getElementById('person-list');

        // Parcourir chaque personne dans les données
        data.forEach(person => {
            // Créer un élément de liste pour chaque personne
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.textContent = person.Nom + ' ' + person.Prenom;
            link.href = 'person.html?id=' + person.id;
            listItem.appendChild(link);
            personList.appendChild(listItem);
        });
    })
    .catch(error => console.error('Erreur lors du chargement des données :', error));
