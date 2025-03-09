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
      } else if (person.id >= 1700 && person.id <= 1799) {
        if (person.genre === 'M') {
          homMat.push(person);
        } else {
          femMat.push(person);
        }
      }
      else if (person.id >= 1800 && person.id <= 1999) {
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

function trierParGenerationEtDate(tableau) {
    tableau.sort((a, b) => {
        const genA = extraireGeneration(a.id);
        const genB = extraireGeneration(b.id);
        if (genA !== genB) return genA - genB;

        const yearA = parseInt(a.date_naissance.substr(6, 4));
        const yearB = parseInt(b.date_naissance.substr(6, 4));
        if (yearA === 1901) return 1;
        if (yearB === 1901) return -1;
        return yearB - yearA;
    });
}

function afficheMembres(listElement, titreText, persons) {
    creerTitreEtListe(listElement, titreText);
    ajoutMembresListe(listElement, persons);
}

function creerTitreEtListe(listElement, titreText) {
    const titre = document.createElement('span');
    titre.textContent = titreText;
    titre.classList.add('labelFamille');
    listElement.appendChild(titre);
}

function ajoutMembresListe(listElement, persons) {
    persons.forEach(async person => {
        const listItem = await creerListItem(person);
        listElement.appendChild(listItem);
    });
}

async function creerListItem(person) {
    const li = document.createElement('li');

    const [naissance_R, deces_R, mariage_R, affranchissement_R, special_R] = await Promise.all([
        verifierDocument(person, "naissance"),
        verifierDocument(person, "deces"),
        person.genre === "M" ? verifierDocument(person, "mariage") : Promise.resolve(""),
        verifierDocument(person, "affranchissement"),
        verifierDocumentSpecial(person, "affranchissement"),
    ]);

    const naissance = afficheActe(naissance_R, "naissance",person.date_naissance);
    const deces = afficheActe(deces_R, "deces",person.date_deces);
    const mariage = afficheActe(mariage_R, "mariage",person.date_mariage);
    const affranchissement = afficheActe(affranchissement_R, "affranchissement",person.date_affranchissement);
    const special = afficheActe(special_R, "particulier",person.date_affranchissement);

    li.innerHTML = `
      <a href="${person.id < 2000 ? '../html/person.html?id=' + person.id : person.id > 10000 ? '../html/person.html?id=' + person.id : '#'}" 
         class="${person.genre === 'M' ? 'lienHommeEnGras' : 'lienFemmeEnGras'}">
          ${person.nom} ${person.prenom} (${creerAnAvecCouleur(person.date_naissance)}${person.date_deces ? ' / ' + creerAnAvecCouleur(person.date_deces) : ''}) 
          ${naissance || ''} ${deces || ''} ${mariage || ''} ${affranchissement || ''} ${special || ''} 
          <em>${getOrigine(person.lieu_naissance, person.departement_naissance)} G${extraireGeneration(person.id)}</em>
      </a>
    `;

    return li;
}

function afficheActe(reponse, repertoire, date) {
  if (!date) return ""; // Gérer le cas où la date est absente

  const repPrefix = repertoire.substring(0, 3);
  const jourMois = date.substr(0, 5);
  const year = date.substr(6, 4);

  if (reponse === "KO") {
      // Si la date commence par "01/01", afficher l'année en bleu
      if (jourMois === "01/01") {
          return `<span style="color: blue;">${repPrefix}</span>`;
      }
      // Sinon, afficher le préfixe en rouge
      return `<span style="color: red;">${repPrefix}</span>`;
  }

  // Si "OK", afficher le préfixe en vert
  if (reponse === "OK") {
      return `<span style="color: green;">${repPrefix}</span>`;
  }

  return ""; // Retourne une chaîne vide si la réponse est autre
}


async function verifierDocument(person, repertoire) {
  const dateProperty = 'date_' + repertoire;
  if (!person[dateProperty]) return "PasDeDate";
  
  const extensions = ['pdf', 'jpg', 'JPG'];
  const basePath = `../data/${repertoire}/${person.id}`;

  for (const ext of extensions) {
      const filePath = `${basePath}.${ext}`;
      try {
          await new Promise(resolve => setTimeout(resolve, Math.random() * 1)); // Délai aléatoire entre 0 et 200 ms
          const response = await fetch(filePath, { method: 'HEAD' });
          if (response.ok) return "OK";
      } catch (error) {
          console.error(`Erreur lors de la vérification de ${filePath}:`, error);
      }
  }
  return "KO";
}


async function verifierDocumentSpecial(person, repertoire) {
  const dateProperty = 'date_' + repertoire;
  if (!person[dateProperty]) return "PasDeDate";
  
  const extensions = ['pdf', 'jpg', 'png'];
  const basePath = `../data/particulier/${person.id}`;

  for (const ext of extensions) {
      const filePath = `${basePath}.${ext}`;
      try {
          await new Promise(resolve => setTimeout(resolve, Math.random() * 1)); // Délai aléatoire entre 0 et 200 ms
          const response = await fetch(filePath, { method: 'HEAD' });
          if (response.ok) return "OK";
      } catch (error) {
          console.error(`Erreur lors de la vérification de ${filePath}:`, error);
      }
  }
  return "KO";
}

function creerAnAvecCouleur(date) {
    if (!date) return '';
    const jourMois = date.substr(0, 5);
    const year = date.substr(6, 4);
    if (parseInt(year) === 1901) return `<span style="color: red;">??</span>`;
    if (jourMois === "01/01") return `<span style="color: blue;">${year}</span>`;
    return `<span style="color: green;">${year}</span>`;
}

function extraireGeneration(id) {
    return id >= 10000 ? Math.floor(id / 1000) 
         : id >= 1000 ? parseInt(id.toString().charAt(1), 10) 
         : id >= 100 ? parseInt(id.toString().charAt(0), 10) 
         : 0;
}

function getOrigine(lieuDeNaissance, departement = "") {
    const lieuxAcceptes = ["Afrique", "Warrio - Nigéria", "Nigéria", "Madagascar", "Indes", "France", "Italie", "Pays-Bas", "Portugal"];
    if (!lieuDeNaissance || typeof lieuDeNaissance !== 'string') return "";
    return lieuxAcceptes.includes(lieuDeNaissance) 
         ? lieuDeNaissance === "France" && departement ? `(${departement})` 
         : `(${lieuDeNaissance})` 
         : "";
}
