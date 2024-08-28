fetch('data.json').then(response=>response.json()).then(data=>{

  // Trier DATA par id decroissant
  const dataTri = data.sort((a, b) => b.id - a.id);

  // Filtrer les personnes par genre
  const dataFamily = dataTri.filter(person => person.id <= 203);
  const dataPat= dataTri.filter(person => person.id >= 204 && person.id <= 999);
  const dataMat= dataTri.filter(person => person.id >= 1000 && person.id <= 1999);

   // Filtrer les personnes par genre
  const filterByGender = (people, gender) => people.filter(person => person.genre === gender); 
  const homPat= filterByGender(dataPat, 'M');
  const femPat= filterByGender(dataPat, 'F');
  const homMat= filterByGender(dataMat, 'M');
  const femMat= filterByGender(dataMat, 'F');
  const homFam = filterByGender(dataFamily, 'M');
  const femFam = filterByGender(dataFamily, 'F');
  
  // Creer les elements de liste pour chaque catégorie
  const homPatList = document.getElementById('hom-list-pat');
  const femPatList = document.getElementById('fem-list-pat');
  const homMatList = document.getElementById('hom-list-mat');
  const femMatList = document.getElementById('fem-list-mat');
  const homFamList = document.getElementById('hom-list');
  const femFamList = document.getElementById('fem-list');
  
  // Affichage des hommes de la branche paternelle
  afficheMembres(homPatList, 'Boug coté papa', homPat);

  // Affichage des femmes de la branche paternelle
  afficheMembres(femPatList, 'Fanm coté papa', femPat);

  // Affichage des hommes de la branche maternelle
  afficheMembres(homMatList, 'Boug coté momon', homMat);

  // Affichage des femmes de la branche maternelle
  afficheMembres(femMatList, 'Fanm coté momon', femMat);

  // Affichage des hommes de la famille
  afficheMembres(homFamList, 'Boug', homFam);

  // Affichage des femmes de la famille
  afficheMembres(femFamList, 'Fanm', femFam);
  
}).catch(error=>console.error('Erreur lors du chargement des données :', error));

// Ajouter le titre et alimenter les membres
function afficheMembres(listElement, titreText, persons) {
  creerTitreEtListe(listElement, titreText);
  ajoutMembresListe(listElement, persons);
}

// Creer le titre et liste
function creerTitreEtListe(listElement, titreText) {
  const titre = document.createElement('p');
  titre.textContent = titreText;
  titre.classList.add('label');
  listElement.appendChild(titre);
}

/* function ajoutMembresListe(listElement, persons) {
  persons.forEach(person => {
    const listItem = creerListItem(person);
    listElement.appendChild(listItem);
  });
} */

// Ajouter les membres de la liste
function ajoutMembresListe(listElement, persons) {
  const fragment = document.createDocumentFragment();
  persons.forEach(person => {
    const listItem = creerListItem(person);
    fragment.appendChild(listItem);
  });
  listElement.appendChild(fragment);
}

// Ajoute un membre a la liste
function creerListItem(person) {
  const li = document.createElement('li');
  li.className = person.genre === 'M' ? 'hommelist' : 'femmelist';
  li.innerHTML = `
      <a href="${person.id < 2000 ? 'person.html?id=' + person.id : '#'}" class="${person.genre === 'M' ? 'lienM' : 'lienF'}">
          ${person.nom} ${person.prenom} (${creerAnNaissance(person.date_naissance)}${person.date_deces ? ' / ' + creerAnDeces(person.date_deces) : ''}) 
          <em>${getOrigine(person.lieu_naissance)} G${creerGeneration(person)}</em>
      </a>
  `;
  return li;
}

function creerGeneration(person) {
  const personId = person.id;
  let idGeneration;
  if (personId >= 1000 && personId < 2000) {
    // Pour les IDs entre 1000 et 1999, prendre le deuxième chiffre pour la génération
    idGeneration = parseInt(personId.toString().charAt(1), 10);
  } else if (personId >= 100) {
    // Pour les IDs entre 100 et 999, prendre le premier chiffre pour la génération
    idGeneration = parseInt(personId.toString().charAt(0), 10);
  } else if (personId >= 0) {
    // Pour les IDs inférieurs à 100, génération 0
    idGeneration = 0;
  } else {
    // Pour les IDs non conformes, on retourne une génération inconnue
    return "";
  }
  return "G" + idGeneration;
}

function creerAnNaissance(date) {
  const year = parseInt(date.substr(6, 4)); // Extrait l'année à partir de la chaîne de date
  if (year === 1901) {
    return '??'; // Retourne un point d'interrogation pour indiquer une année inconnue
  }
  return year;
}

function creerAnDeces(date) {
  const year = parseInt(date.substr(6, 4)); 
  if (year === 1901) {
    return '??'; // 
  }
  return year;
}

function getOrigine(lieuDeNaissance) {
  // Vérification des valeurs nulles, indéfinies ou de type incorrect
  if (!lieuDeNaissance || typeof lieuDeNaissance !== 'string') {
    return ""; // Retourne une chaîne vide pour indiquer un lieu inconnu ou invalide
  }
  const lieuxAcceptes = ["Afrique", "Warrio - Nigéria", "Nigéria", "Madagascar", "Indes", "France"];
  return lieuxAcceptes.includes(lieuDeNaissance) ? `(${lieuDeNaissance})` : "";
}


