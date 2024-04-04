// Récupérer la liste des personnes à partir du fichier JSON
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        // Filtrer les personnes par genre
        const famille = data.filter(person => person.genre === 'M' && person.id <= 203);
        const hommes = data.filter(person => person.genre === 'M' && person.id >= 204 && person.id <= 999);
        const femmes = data.filter(person => person.genre === 'F' && person.id >= 204 && person.id <= 999);
        const hommesMat = data.filter(person => person.genre === 'M' && person.id >= 1000 && person.id <= 1999); 
        const femmesMat = data.filter(person => person.genre === 'F' && person.id >= 1000 && person.id <= 1999);
        
        const hommeList = document.getElementById('homme-list');
        const femmeList = document.getElementById('femme-list');
        const hommeListMat = document.getElementById('homme-list');
        const femmeListMat = document.getElementById('femme-list'); 
        const familleList = document.getElementById('famille-list');       
        
        // Titre pour la liste de famille
        const familleTitle = document.createElement('h5');
        familleTitle.style.color = "blue";
        familleTitle.style.fontStyle ="italic";
        familleTitle.textContent = 'Famille';
        familleList.appendChild(familleTitle);

        // Parcourir chaque membre dans les données
        famille.sort((a, b) => b.id - a.id);
        famille.forEach(person => {
            // Créer un élément de liste pour chaque membre
            const listItemMat = document.createElement('li');
            const linkMat = document.createElement('a');
            linkMat.textContent = person.nom + ' ' + person.prenom;
            linkMat.href = 'person.html?id=' + person.id;
            if (person.genre === "M") {
                linkMat.classList.add("lienM"); //ajout la classe lien du ccs au lien
            } 
            else {
                linkMat.classList.add("lienF"); //ajout la classe lien du ccs au lien
            }   
            listItemMat.appendChild(linkMat);
            familleList.appendChild(listItemMat);
        });

        // Titre pour la liste des hommes
        const hommeTitle = document.createElement('h5');
        hommeTitle.style.color = "blue";
        hommeTitle.style.fontStyle ="italic";
        hommeTitle.textContent = 'Hommes (Branche Paternelle)';
        hommeList.appendChild(hommeTitle);
        
        // Parcourir chaque homme dans les données
        hommes.sort((a, b) => b.id - a.id);
        hommes.forEach(person => {
            // Créer un élément de liste pour chaque homme
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.textContent = person.nom + ' ' + person.prenom;
            link.href = 'person.html?id=' + person.id;
            link.classList.add("lien"); //ajout la classe lien du ccs au lien
            listItem.appendChild(link);
            hommeList.appendChild(listItem);
        });

        // Titre pour la liste des femmes
        const femmeTitle = document.createElement('h5');
        femmeTitle.style.color = "blue";
        femmeTitle.style.fontStyle ="italic";
        femmeTitle.textContent = 'Femmes (Branche Paternelle)';
        femmeList.appendChild(femmeTitle);
        
        // Parcourir chaque femme dans les données
        femmes.sort((a, b) => b.id - a.id);
        femmes.forEach(person => {
            // Créer un élément de liste pour chaque femme
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.textContent = person.nom + ' ' + person.prenom;
            link.href = 'person.html?id=' + person.id;
            link.classList.add("lien"); //ajout la classe lien du ccs au lien
            listItem.appendChild(link);
            femmeList.appendChild(listItem);
        });
        
         // Titre pour la liste des hommes coté maternelle
        const hommeTitleMat = document.createElement('h5');
        hommeTitleMat.style.color = "blue";
        hommeTitleMat.style.fontStyle ="italic";
        hommeTitleMat.textContent = 'Hommes (Branche Maternelle)';
        hommeListMat.appendChild(hommeTitleMat);
        
        // Parcourir chaque homme dans les données
        hommesMat.sort((a, b) => b.id - a.id);
        hommesMat.forEach(person => {
            // Créer un élément de liste pour chaque homme
            const listItemMat = document.createElement('li');
            const linkMat = document.createElement('a');
            linkMat.textContent = person.nom + ' ' + person.prenom;
            linkMat.href = 'person.html?id=' + person.id;
            linkMat.classList.add("lien"); //ajout la classe lien du ccs au lien
            listItemMat.appendChild(linkMat);
            hommeListMat.appendChild(listItemMat);
        });

        // Titre pour la liste des femmes coté maternelle
        const femmeTitleMat = document.createElement('h5');
        femmeTitleMat.style.color = "blue";
        femmeTitleMat.style.fontStyle ="italic";
        femmeTitleMat.textContent = 'Femmes (Branche Maternelle)';
        femmeListMat.appendChild(femmeTitleMat);
        
        // Parcourir chaque femme dans les données
        femmesMat.sort((a, b) => b.id - a.id);
        femmesMat.forEach(person => {
            // Créer un élément de liste pour chaque femme
            const listItemMat = document.createElement('li');
            const linkMat = document.createElement('a');
            linkMat.textContent = person.nom + ' ' + person.prenom;
            linkMat.href = 'person.html?id=' + person.id;
            linkMat.classList.add("lien"); //ajout la classe lien du ccs au lien
            listItemMat.appendChild(linkMat);
            femmeListMat.appendChild(listItemMat);
        });



        
    })
    .catch(error => console.error('Erreur lors du chargement des données :', error));
