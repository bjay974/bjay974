// Récupérer la liste des personnes à partir du fichier JSON

        // Charger les données depuis le fichier JSON
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                // Trier les données par date de naissance
                data.sort((a, b) => {
                    const dateA = new Date(a.date_naissance);
                    const dateB = new Date(b.date_naissance);
                    return dateA - dateB;
                });

        // Parcourir chaque personne dans les données
        data.forEach(person => {
            // Créer un élément de liste pour chaque personne
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.textContent = person.nom + ' ' + person.prenom;
            link.href = 'person.html?id=' + person.id;
            listItem.appendChild(link);
            personList.appendChild(listItem);
        });
    })
    .catch(error => console.error('Erreur lors du chargement des données :', error));


