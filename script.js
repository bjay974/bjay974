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

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Liste des personnes par date de naissance</title>
</head>
<body>
    <h1>Liste des personnes par date de naissance</h1>
    <ul id="person-list"></ul>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const personList = document.getElementById('person-list');

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

                    // Parcourir les données triées et afficher les noms et prénoms
                    data.forEach(person => {
                        const listItem = document.createElement('li');
                        listItem.textContent = `${person.nom} ${person.prenom}`;
                        personList.appendChild(listItem);
                    });
                })
                .catch(error => console.error('Erreur lors du chargement des données JSON :', error));
        });
    </script>
</body>
</html>

