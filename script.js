fetch('data.json')
    .then(response => response.json())
    .then(data => {
        // Filtrer les personnes par genre
        const famille = data.filter(person => person.id <= 203);
        const hommesFamille = famille.filter(person => person.genre === 'M');
        const femmesFamille = famille.filter(person => person.genre === 'F');

        const branchePaternelle = data.filter(person => person.id >= 204 && person.id <= 999);
        const hommesBranchePaternelle = branchePaternelle.filter(person => person.genre === 'M');
        const femmesBranchePaternelle = branchePaternelle.filter(person => person.genre === 'F');

        const brancheMaternelle = data.filter(person => person.id >= 1000 && person.id <= 1999);
        const hommesBrancheMaternelle = brancheMaternelle.filter(person => person.genre === 'M');
        const femmesBrancheMaternelle = brancheMaternelle.filter(person => person.genre === 'F');

        const familleList = document.getElementById('famille-list');
        const hommefamilleList = document.getElementById('homme-list');
        const femmefamilleList = document.getElementById('femme-list');
        const hommepaternelleList = document.getElementById('homme-list-paternelle');
        const femmepaternelleList = document.getElementById('femme-list-paternelle');
        const hommematernelleList = document.getElementById('homme-list-maternelle');
        const femmematernelleList = document.getElementById('femme-list-maternelle');

        // Affichage des hommes de la famille
        const titlehommefamilleList = document.createElement('p');
        titlehommefamilleList.textContent = "Boug";
        titlehommefamilleList.classList.add('label'); 
        hommefamilleList.appendChild(titlehommefamilleList);
        hommesFamille.forEach(person => {
            const listItem = createListItem(person);
            hommefamilleList.appendChild(listItem);
        });

        // Affichage des femmes de la famille
        const titlefemmefamilleList = document.createElement('p');
        titlefemmefamilleList.textContent = "Boug";
        titlefemmefamilleList.classList.add('label'); 
        hommefamilleList.appendChild(titlefemmefamilleList);
        femmesFamille.forEach(person => {
            const listItem = createListItem(person);
            femmefamilleList.appendChild(listItem);
        });

        // Affichage des hommes de la branche paternelle
        hommesBranchePaternelle.forEach(person => {
            const listItem = createListItem(person);
            hommepaternelleList.appendChild(listItem);
        });

        // Affichage des femmes de la branche paternelle
        femmesBranchePaternelle.forEach(person => {
            const listItem = createListItem(person);
            femmepaternelleList.appendChild(listItem);
        });

        // Affichage des hommes de la branche maternelle
        hommesBrancheMaternelle.forEach(person => {
            const listItem = createListItem(person);
            hommematernelleList.appendChild(listItem);
        });

        // Affichage des femmes de la branche maternelle
        femmesBrancheMaternelle.forEach(person => {
            const listItem = createListItem(person);
            femmematernelleList.appendChild(listItem);
        });

    })
    .catch(error => console.error('Erreur lors du chargement des données :', error));

function createListItem(person) {
    const listItem = document.createElement('li');
    if (person.genre === "M") {
        listItem.classList.add("hommelist");
    }
    else {
        listItem.classList.add("femmelist");
    }
    const link = document.createElement('a');
    link.textContent = person.nom + ' ' + person.prenom;
    link.href = 'person.html?id=' + person.id;
    if (person.genre === "M") {
        link.classList.add("lienM");
    }
    else {
        link.classList.add("lienF");
    }
    listItem.appendChild(link);
    return listItem;
}
