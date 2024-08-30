fetch('data.json')
  .then(response => response.json())
  .then(data => {
    // Initialisation des tableaux pour chaque catégorie
    const homFam = [], femFam = [];
    const homPat = [], femPat = [];
    const homMat = [], femMat = [];

    // Parcourt chaque personne et les répartir dans les tableaux correspondants
    data.forEach(person => {
      if (person.id <= 203) {
        if (person.genre === 'M') {
          homFam.push(person);
        } else {
          femFam.push(person);
        }
      } else if (person.id >= 204 && person.id <= 999) {
        if (person.genre === 'M') {
          homPat.push(person);
        } else {
          femPat.push(person);
        }
      } else if (person.id >= 1000 && person.id <= 1999) {
        if (person.genre === 'M') {
          homMat.push(person);
        } else {
          femMat.push(person);
        }
      }
    });

    // Trie chaque tableau par ID de manière décroissante
    homFam.sort((a, b) => b.id - a.id);
    femFam.sort((a, b) => b.id - a.id);
    homPat.sort((a, b) => b.id - a.id);
    femPat.sort((a, b) => b.id - a.id);
    homMat.sort((a, b) => b.id - a.id);
    femMat.sort((a, b) => b.id - a.id);

    // Création des éléments de liste pour chaque catégorie
    const homPatList = document.getElementById('hom-list-pat');
    const femPatList = document.getElementById('fem-list-pat');
    const homMatList = document.getElementById('hom-list-mat');
    const femMatList = document.getElementById('fem-list-mat');
    const homFamList = document.getElementById('hom-list');
    const femFamList = document.getElementById('fem-list');

    // Affichage des membres pour chaque catégorie
    afficheMembres(homPatList, 'Boug coté papa', homPat);
    afficheMembres(femPatList, 'Fanm coté papa', femPat);
    afficheMembres(homMatList, 'Boug coté momon', homMat);
    afficheMembres(femMatList, 'Fanm coté momon', femMat);
    afficheMembres(homFamList, 'Boug', homFam);
    afficheMembres(femFamList, 'Fanm', femFam);
  })
  .catch(error => console.error('Erreur lors du chargement des données :', error));

// Les autres fonctions restent inchangées...


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
  li.className = person.genre === 'M' ? 'homlist' : 'femlist';
  li.innerHTML = `
      <a href="${person.id < 2000 ? 'person.html?id=' + person.id : '#'}" class="${person.genre === 'M' ? 'hommeEnGras' : 'femmeEnGras'}">
          ${person.nom} ${person.prenom} (${creerAn(person.date_naissance)}${person.date_deces ? ' / ' + creerAn(person.date_deces) : ''}) 
          <em>${getOrigine(person.lieu_naissance)} ${creerGeneration(person)}</em>
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

function creerAn(date) {
  const year = parseInt(date.substr(6, 4)); // Extrait l'année à partir de la chaîne de date
  if (year === 1901) {
    return '??'; // Retourne un point d'interrogation pour indiquer une année inconnue
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


