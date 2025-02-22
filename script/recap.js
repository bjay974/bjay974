fetch('../data/data.json')
  .then(response => response.json())
  .then(data => {
    // Initialisation des tableaux pour chaque catégorie
    const homFam = [], femFam = [];
    const homPat = [], femPat = [];
    const homMat = [], femMat = [];
    const homGen = [], femGen = [];

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
      else if (person.id >= 10000 && person.id <= 19999) {
        if (person.genre === 'M') {
          homGen.push(person);
        } else {
          femGen.push(person);
        }
      }      
    });
 
    // Appliquer le tri à chaque catégorie
    [homFam, femFam, homPat, femPat, homMat, femMat, homGen, femGen].forEach(trierParGenerationEtDate);

    // Création des éléments de liste pour chaque catégorie
    const homFamList = document.getElementById('hom-list');
    const femFamList = document.getElementById('fem-list');
    const homPatList = document.getElementById('hom-list-pat');
    const femPatList = document.getElementById('fem-list-pat');
    const homMatList = document.getElementById('hom-list-mat');
    const femMatList = document.getElementById('fem-list-mat');
    const homGenList = document.getElementById('hom-list-gen');
    const femGenList = document.getElementById('fem-list-gen');    

    // Affichage des membres pour chaque catégorie
    afficheMembres(homFamList, 'Boug', homFam);
    afficheMembres(femFamList, 'Fanm', femFam);
    afficheMembres(homPatList, 'Boug coté papa', homPat);
    afficheMembres(femPatList, 'Fanm coté papa', femPat);
    afficheMembres(homMatList, 'Boug coté momon', homMat);
    afficheMembres(femMatList, 'Fanm coté momon', femMat);
    afficheMembres(homGenList, 'Zancet boug', homGen);
    afficheMembres(femGenList, 'Zancet Fanm', femGen);

  })
  .catch(error => console.error('Erreur lors du chargement des données :', error));

   // Fonction de tri par génération et date

   function trierParGenerationEtDate(tableau) {
    tableau.sort((a, b) => {
        const genA = extraireGeneration(a.id); // Génération de A
        const genB = extraireGeneration(b.id); // Génération de B

        // Trier par génération d'abord (plus grande génération en premier)
        if (genA !== genB) {
            return genA - genB;
        }

        // Si même génération, trier par date inconnue d'abord
        const yearA = parseInt(a.date_naissance.substr(6, 4));
        const yearB = parseInt(b.date_naissance.substr(6, 4));
        const yearAInconnue = parseInt(a.date_naissance.substr(6, 4)) === "1901";
        const yearBInconnue = parseInt(b.date_naissance.substr(6, 4)) === "1901";

        if (yearAInconnue && !yearBInconnue) {
            return 1; // A après B si A a une date inconnue et B une date connue
        }
        if (yearBInconnue && !yearAInconnue) {
            return -1; // B après A si B a une date inconnue et A une date connue
        }

        // Si les deux ont des dates connues, trier du plus âgé au moins âgé
        return yearB - yearA; // Plus âgé en premier
    });
}

  

  // Extraire la génération d'une personne à partir de son ID
  function extraireGeneration(id) {
    if (id >= 10000) {
      return Math.floor(id / 1000); // Ex. ID 12898 -> Génération 12
    } else if (id >= 1000 && id < 2000) {
      return parseInt(id.toString().charAt(1), 10); // Ex. ID 1289 -> Génération 2
    } else if (id >= 100 && id < 1000) {
      return parseInt(id.toString().charAt(0), 10); // Ex. ID 289 -> Génération 2
    } else {
      return 0; // Génération par défaut pour les ID < 100
    }
  }


// Ajouter le titre et alimenter les membres
function afficheMembres(listElement, titreText, persons) {
  creerTitreEtListe(listElement, titreText);
  ajoutMembresListe(listElement, persons);
}

// Creer le titre et liste
function creerTitreEtListe(listElement, titreText) {
  const titre = document.createElement('span');
  titre.textContent = titreText;
  titre.classList.add('labelFamille');
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

function creerListItem(person) {
  const li = document.createElement('li');
  // Fonction pour générer l'année avec indication de couleur
  function creerAnAvecCouleur(date) {
    if (!date) return '';
    const jourMois = date.substr(0, 5);
    const year = date.substr(6, 4);
    const yearInt = parseInt(year);
    if (yearInt === 1901) {
      return `<span style="color: red;">${year}</span>`; // Année inconnue en rouge
    }
    // Vérifier si la date est uniquement une année (01/01/XXXX)
    if (jourMois === "01/01") {
      return `<span style="color: blue;">${year}</span>`; // Année seule en bleue
    }
    return `<span style="color: green;">${year}</span>`; // Année complète
  }
  naissance_R = verifierDocument(person, "naissance");
  deces_R = verifierDocument(person, "deces");
  mariage_R = verifierDocument(person, "mariage");
  affranchissement_R = verifierDocument(person, "affranchissiment");
  special_R= verifierDocumentSpecial(person, "affranchissiment");
  const resultat = `
  ${naissance_R ? afficheActe(naissance_R, "naissance") : ''}
  ${deces_R ? afficheActe(deces_R, "deces") : ''}
  ${mariage_R ? afficheActe(mariage_R, "mariage") : ''}
  ${affranchissement_R ? afficheActe(affranchissement_R, "affranchissement") : ''}
  ${special_R ? afficheActe(special_R, "particulier") : ''}
`;
  li.innerHTML = `
  <a href="${person.id < 2000 ? '../html/person.html?id=' + person.id : person.id > 10000 ? '../html/person.html?id=' + person.id : '#'}" 
     class="${person.genre === 'M' ? 'lienHommeEnGras' : 'lienFemmeEnGras'}">
      ${person.nom} ${person.prenom} (${creerAnAvecCouleur(person.date_naissance)}${person.date_deces ? ' / ' + creerAnAvecCouleur(person.date_deces) : ''}) 
      ${resultat}  <em>${getOrigine(person.lieu_naissance, person.departement_naissance)} G${extraireGeneration(person.id)}</em>
  </a>
`;
  return li;
}

async function verifierDocument(person, repertoire) {
  // Construire le nom de la propriété de date en fonction du répertoire
  const dateProperty = 'date' + repertoire.charAt(0).toUpperCase() + repertoire.slice(1);
   // Vérifier si la propriété de date existe et est définie
    if (person[dateProperty]) {
      // Construire le chemin vers le fichier en utilisant l'ID de la personne
      const filePath = `../data/${repertoire}/${person.id}.*`; // Supposons que les fichiers soient au format PDF
      try {
        // Tenter de récupérer le fichier
        const response = await fetch(filePath, { method: 'HEAD' });
        // Vérifier si la réponse est positive
        return response.ok; // Retourne true si le fichier existe, sinon false
      } catch (error) {
        // En cas d'erreur (par exemple, problème réseau), retourner false
        return false;
      }
    } 
}

async function verifierDocumentSpecial(person, repertoire) {
  // Construire le nom de la propriété de date en fonction du répertoire
  const dateProperty = 'date' + repertoire.charAt(0).toUpperCase() + repertoire.slice(1);
   // Vérifier si la propriété de date existe et est définie
    if (person[dateProperty]) {
      // Construire le chemin vers le fichier en utilisant l'ID de la personne
      const filePath = `../data/particulier/${person.id}.*`; // Supposons que les fichiers soient au format PDF
      try {
        // Tenter de récupérer le fichier
        const response = await fetch(filePath, { method: 'HEAD' });
        // Vérifier si la réponse est positive
        return response.ok; // Retourne true si le fichier existe, sinon false
      } catch (error) {
        // En cas d'erreur (par exemple, problème réseau), retourner false
        return false;
      }
    } 
}

function afficheActe(reponse,repertoire) {
  const repPrefix = repertoire.substring(0, 3);
  if (reponse.ok) {
    return `<span style="color: green;">${repPrefix}</span>`;
  } else {
    return `<span style="color: red;">${repPrefix}</span>`;    
  }
}

function creerAn(date) {
    const year = parseInt(date.substr(6, 4));
    if (year === 1901) {
      return '??';
    }
    return year;
}

function getOrigine(lieuDeNaissance, departement = "") {
  if (!lieuDeNaissance || typeof lieuDeNaissance !== 'string') {
    return "";
  }
  const lieuxAcceptes = ["Afrique", "Warrio - Nigéria", "Nigéria", "Madagascar", "Indes", "France", "Italie", "Pays-Bas", "Portugal"];

  // Si le lieu est accepté
  if (lieuxAcceptes.includes(lieuDeNaissance)) {
    // Si le lieu est "France", ajouter le département si présent
    if (lieuDeNaissance === "France") {
      if (departement && typeof departement === 'string') {
        return `(${departement})`;
      }
      return "(France)"; // Si le département est manquant
    }
    return `(${lieuDeNaissance})`; // Pour les autres lieux
  }
  return ""; // Lieu non accepté
}

