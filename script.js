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
        const hommeListFamille = document.getElementById('famille-list');
        const femmeListFamille = document.getElementById('famille-list');
        const hommeListPaternelle = document.getElementById('list-paternelle');
        const femmeListPaternelle = document.getElementById('list-paternelle');
        const hommeListMaternelle = document.getElementById('list-maternelle');
        const femmeListMaternelle = document.getElementById('list-maternelle');

        // Titre pour la liste de famille
        const familleTitle = document.createElement('h5');
        familleTitle.classList.add("soustitre")
        familleTitle.textContent = 'A nou';
        familleList.appendChild(familleTitle);

        // Affichage des hommes de la famille
        hommesFamille.forEach(person => {
            const listItem = createListItem(person);
            hommeListFamille.appendChild(listItem);
        });

        // Affichage des femmes de la famille
        femmesFamille.forEach(person => {
            const listItem = createListItem(person);
            femmeListFamille.appendChild(listItem);
        });

        // Titre pour la branche paternelle
        const paternelleTitle = document.createElement('h5');
        paternelleTitle.classList.add("soustitre")
        paternelleTitle.textContent = 'Coté Papa';
        familleList.appendChild(paternelleTitle);

        // Affichage des hommes de la branche paternelle
        hommesBranchePaternelle.forEach(person => {
            const listItem = createListItem(person);
            hommeListPaternelle.appendChild(listItem);
        });

        // Affichage des femmes de la branche paternelle
        femmesBranchePaternelle.forEach(person => {
            const listItem = createListItem(person);
            femmeListPaternelle.appendChild(listItem);
        });

        // Titre pour la branche maternelle
        const maternelleTitle = document.createElement('h5');
        maternelleTitle.classList.add("soustitre")
        maternelleTitle.textContent = 'Coté Momon';
        familleList.appendChild(maternelleTitle);

        // Affichage des hommes de la branche maternelle
        hommesBrancheMaternelle.forEach(person => {
            const listItem = createListItem(person);
            hommeListMaternelle.appendChild(listItem);
        });

        // Affichage des femmes de la branche maternelle
        femmesBrancheMaternelle.forEach(person => {
            const listItem = createListItem(person);
            femmeListMaternelle.appendChild(listItem);
        });

    })
    .catch(error => console.error('Erreur lors du chargement des données :', error));

function createListItem(person) {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.textContent = person.nom + ' ' + person.prenom;
    link.href = 'person.html?id=' + person.id;
    if (person.genre === "M") {
        link.classList.add("hommelist");
    }
    else {
        link.classList.add("femmelist");
    }
    listItem.appendChild(link);
    return listItem;
}
