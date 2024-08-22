fetch('data.json').then(response=>response.json()).then(data=>{
    // Filtrer les personnes par genre
    const famille = data.filter(person=>person.id <= 203);
    const hommesFamille = famille.filter(person=>person.genre === 'M');
    const femmesFamille = famille.filter(person=>person.genre === 'F');
    const branchePaternelle = data.filter(person=>person.id >= 204 && person.id <= 999);
    const hommesBranchePaternelle = branchePaternelle.filter(person=>person.genre === 'M');
    const femmesBranchePaternelle = branchePaternelle.filter(person=>person.genre === 'F');
    const brancheMaternelle = data.filter(person=>person.id >= 1000 && person.id <= 1999);
    const hommesBrancheMaternelle = brancheMaternelle.filter(person=>person.genre === 'M');
    const femmesBrancheMaternelle = brancheMaternelle.filter(person=>person.genre === 'F');
    const familleList = document.getElementById('famille-list');
    const hommefamilleList = document.getElementById('homme-list');
    const femmefamilleList = document.getElementById('femme-list');
    const hommepaternelleList = document.getElementById('homme-list-paternelle');
    const femmepaternelleList = document.getElementById('femme-list-paternelle');
    const hommematernelleList = document.getElementById('homme-list-maternelle');
    const femmematernelleList = document.getElementById('femme-list-maternelle');
    // Affichage des hommes de la branche paternelle
    const titlehommepaternelleList = document.createElement('p');
    titlehommepaternelleList.textContent = 'Boug coté papa';
    titlehommepaternelleList.classList.add('label');
    hommepaternelleList.appendChild(titlehommepaternelleList);
    hommesBranchePaternelle.sort((a, b) => b.id - a.id);
    hommesBranchePaternelle.forEach(person=>{
      const listItem = createListItem(person);
      hommepaternelleList.appendChild(listItem);
    });
    // Affichage des femmes de la branche paternelle
    const titlefemmepaternelleList = document.createElement('p');
    titlefemmepaternelleList.textContent = 'Fanm coté papa';
    titlefemmepaternelleList.classList.add('label');
    femmepaternelleList.appendChild(titlefemmepaternelleList);
    femmesBranchePaternelle.sort((a, b) => b.id - a.id);
    femmesBranchePaternelle.forEach(person=>{
      const listItem = createListItem(person);
      femmepaternelleList.appendChild(listItem);
    });
    // Affichage des hommes de la branche maternelle
    const titlehommematernelleList = document.createElement('p');
    titlehommematernelleList.textContent = 'Boug coté momon';
    titlehommematernelleList.classList.add('label');
    hommematernelleList.appendChild(titlehommematernelleList);
    hommesBrancheMaternelle.sort((a, b) => b.id - a.id);
    hommesBrancheMaternelle.forEach(person=>{
      const listItem = createListItem(person);
      hommematernelleList.appendChild(listItem);
    });
    // Affichage des femmes de la branche maternelle
    const titlefemmematernelleList = document.createElement('p');
    titlefemmematernelleList.textContent = 'Fanm coté momon';
    titlefemmematernelleList.classList.add('label');
    femmematernelleList.appendChild(titlefemmematernelleList);
    femmesBrancheMaternelle.sort((a, b) => b.id - a.id);
    femmesBrancheMaternelle.forEach(person=>{
      const listItem = createListItem(person);
      femmematernelleList.appendChild(listItem);
    });
    // Affichage des hommes de la famille
    const titlehommefamilleList = document.createElement('p');
    titlehommefamilleList.textContent = 'Boug';
    titlehommefamilleList.classList.add('label');
    hommefamilleList.appendChild(titlehommefamilleList);
    hommesFamille.forEach(person=>{
      const listItem = createListItem(person);
      hommefamilleList.appendChild(listItem);
    });
    // Affichage des femmes de la famille
    const titlefemmefamilleList = document.createElement('p');
    titlefemmefamilleList.textContent = 'Fanm';
    titlefemmefamilleList.classList.add('label');
    femmefamilleList.appendChild(titlefemmefamilleList);
    femmesFamille.forEach(person=>{
      const listItem = createListItem(person);
      femmefamilleList.appendChild(listItem);
    });
  }).catch(error=>console.error('Erreur lors du chargement des données :', error));


  function createListItem(person) {
    const listItem = document.createElement('li');
    if (person.genre === 'M') {
      listItem.classList.add('hommelist');
    } 
    else {
      listItem.classList.add('femmelist');
    }
    
    const listGeneration = createGenerationId(person);
    const listAnNaissance = createAnNaissance(person.date_naissance);
    let listAnDeces = '';
    if (person.date_deces) {
      listAnDeces = createAnDeces(person.date_deces);
    }
    const personOrigine = person.origine;

    const link = document.createElement('a');
    
    // Ajout du nom et prénom
    const namePart = document.createTextNode(person.nom + ' ' + person.prenom + '  ');
    link.appendChild(namePart);

    // Ajout de l'année de naissance en taille inférieure
    const naissancePart = document.createElement('span');
    naissancePart.style.fontSize = 'smaller';
    naissancePart.textContent = '(' + listAnNaissance;
    link.appendChild(naissancePart);

    // Ajout de la date de décès s'il y en a une
    if (listAnDeces) {
      const decesPart = document.createElement('span');
      decesPart.style.fontSize = 'smaller';
      decesPart.textContent = ' / ' + listAnDeces + ' ) ';
      link.appendChild(decesPart);
    } else {
      const closeParenthesis = document.createTextNode(' ) ');
      link.appendChild(closeParenthesis);
    }

    // Ajout de l'origine en italique
    if (personOrigine) {
      const originePart = document.createElement('em');
      originePart.style.fontSize = 'smaller';
      originePart.textContent = ' (' + personOrigine + ') ';
      link.appendChild(originePart);
    }

    // Ajout de la génération
    const generationPart = document.createElement('em');
    generationPart.style.fontSize = 'smaller';
    generationPart.textContent = ' ' + listGeneration;
    link.appendChild(generationPart);

    if (person.id < 2000) {
      link.href = 'person.html?id=' + person.id;
    }
    
    if (person.genre === 'M') {
      link.classList.add('lienM');
    } 
    else {
      link.classList.add('lienF');
    }
    
    listItem.appendChild(link);
    return listItem;
}


  function createGenerationId(person) {
    const personId = person.id.toString();
    let idGeneration;
    if (person.id < 100) {
      idGeneration = 0
    } 
    else if (person.id < 1000) {
      idGeneration = parseInt(personId.charAt(0));

    } else if (person.id >= 1000 && person.id < 2000) {
      // Prendre les deux premiers chiffres de l'ID
      idGeneration = parseInt(personId.substr(1, 1));
    }
    return "G" + idGeneration;
  }
  function createAnNaissance(date) {
    const year = parseInt(date.substr(6, 4)); // Extrait l'année à partir de la chaîne de date
    if (year === 1901) {
      return '??'; // Retourne un point d'interrogation pour indiquer une année inconnue
    }
    return year;
  }
  function createAnDeces(date) {
    const year = parseInt(date.substr(6, 4)); // Extrait l'année à partir de la chaîne de date
    if (year === 1901) {
      return '??'; // Retourne un point d'interrogation pour indiquer une année inconnue
    }
    return year;
  }
  