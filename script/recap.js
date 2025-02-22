fetch('../data/data.json')
  .then(response => response.json())
  .then(data => {
    const homFam = [], femFam = [];
    const homPat = [], femPat = [];
    const homMat = [], femMat = [];
    const homGen = [], femGen = [];

    data.forEach(person => {
      if (person.id <= 203) {
        (person.genre === 'M' ? homFam : femFam).push(person);
      } else if (person.id <= 999) {
        (person.genre === 'M' ? homPat : femPat).push(person);
      } else if (person.id <= 1999) {
        (person.genre === 'M' ? homMat : femMat).push(person);
      } else if (person.id <= 19999) {
        (person.genre === 'M' ? homGen : femGen).push(person);
      }
    });

    [homFam, femFam, homPat, femPat, homMat, femMat, homGen, femGen].forEach(trierParGenerationEtDate);

    afficheMembres(document.getElementById('hom-list'), 'Boug', homFam);
    afficheMembres(document.getElementById('fem-list'), 'Fanm', femFam);
    afficheMembres(document.getElementById('hom-list-pat'), 'Boug coté papa', homPat);
    afficheMembres(document.getElementById('fem-list-pat'), 'Fanm coté papa', femPat);
    afficheMembres(document.getElementById('hom-list-mat'), 'Boug coté momon', homMat);
    afficheMembres(document.getElementById('fem-list-mat'), 'Fanm coté momon', femMat);
    afficheMembres(document.getElementById('hom-list-gen'), 'Zancet boug', homGen);
    afficheMembres(document.getElementById('fem-list-gen'), 'Zancet Fanm', femGen);
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
        verifierDocument(person, "mariage"),
        verifierDocument(person, "affranchissement"),
        verifierDocumentSpecial(person, "particulier"),
    ]);

    const naissance = afficheActe(naissance_R, "naissance");
    const deces = afficheActe(deces_R, "deces");
    const mariage = afficheActe(mariage_R, "mariage");
    const affranchissement = afficheActe(affranchissement_R, "affranchissement");
    const special = afficheActe(special_R, "particulier");

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

function afficheActe(reponse, repertoire) {
    const repPrefix = repertoire.substring(0, 3);
    return reponse === "OK" ? `<span style="color: green;">${repPrefix}</span>` 
         : reponse === "KO" ? `<span style="color: red;">${repPrefix}</span>` 
         : null;
}

async function verifierDocument(person, repertoire) {
    const dateProperty = 'date_' + repertoire;
    if (!person[dateProperty]) return "PasDeDate";

    const extensions = ['pdf', 'jpg', 'png'];
    const basePath = `../data/${repertoire}/${person.id}`;

    for (const ext of extensions) {
        const filePath = `${basePath}.${ext}`;
        try {
            const response = await fetch(filePath, { method: 'HEAD' });
            if (response.ok) return "OK";
        } catch (error) {
            console.error(`Erreur lors de la vérification de ${filePath}:`, error);
        }
    }
    return "KO";
}

async function verifierDocumentSpecial(person, repertoire) {
    return verifierDocument(person, `particulier/${person.id}`);
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
