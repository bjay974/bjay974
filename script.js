// Récupérer la liste des personnes à partir du fichier JSON
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        // Filtrer les personnes par genre
        const hommes = data.filter(person => person.Genre === 'M');
        const femmes = data.filter(person => person.Genre === 'F');

        const hommeList = document.getElementById('homme-list');
        const femmeList = document.getElementById('femme-list');
        
        // Titre pour la liste des hommes
        const hommeTitle = document.createElement('h2');
        hommeTitle.textContent = 'Hommes';
        hommeList.appendChild(hommeTitle);
        
        // Parcourir chaque homme dans les données
        hommes.forEach(person => {
            // Créer un élément de liste pour chaque homme
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.textContent = person.nom + ' ' + person.prenom;
            link.href = 'person.html?id=' + person.id;
            listItem.appendChild(link);
            hommeList.appendChild(listItem);
        });

        // Titre pour la liste des femmes
        const femmeTitle = document.createElement('h2');
        femmeTitle.textContent = 'Femmes';
        femmeList.appendChild(femmeTitle);
        
        // Parcourir chaque femme dans les données
        femmes.forEach(person => {
            // Créer un élément de liste pour chaque femme
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.textContent = person.nom + ' ' + person.prenom;
            link.href = 'person.html?id=' + person.id;
            listItem.appendChild(link);
            femmeList.appendChild(listItem);
        });
    })
    .catch(error => console.error('Erreur lors du chargement des données :', error));
