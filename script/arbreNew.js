// Fonction pour afficher les données dans la page
function displayData() {

    var urlParams = new URLSearchParams(window.location.search);
    let personId = 302;
    
    // Charger les données depuis le fichier JSON
    fetch('../data/data.json')
        .then(response => response.json())
        .then(data => {
            // Trouver la personne correspondante
            const personData = data.find(p => p.id === parseInt(personId));
            const generations = trouverGenerations(personId); console.log(generations);
            // Afficher les informations de la personne
            afficherPersonne(personData, 'personConteneur');
            // Afficher les parents
            afficherParent(person.id_pere, person.id_mere, 'parentConteneur', data);            
   /*         // Afficher les grands-parents
            var grand = trouverGrandsParents(person.id_pere, person.id_mere, data);
            afficherGrandParent(
                grand.PerePat, grand.MerePat, grand.PereMat, grand.MereMat,'grandparent', data); 
            // Afficher les parents
            afficherParent(person.id_pere, person.id_mere, 'parent', data);
            // Afficher les informations de la personne
            // Afficher les enfants et  petits-enfants
            afficherEnfantsPetitEnfants(person.id, data);  */
        });
  }

function afficherPersonne(personne, containerClass) {
  const afficheDate = creerDate(personne.date_naissance, personne.date_deces);
  const origine = getOrigine(personne.lieu_naissance);
  const classeGenre = personne.genre === 'M' ? 'male' : 'female';

  const conteneur = document.createElement('div');
  conteneur.classList.add(containerClass);
  let lienHtml = `<div class="${classeGenre}">`;
  lienHtml += `<p><a href="../html/arbrePerso.html?id=${personne.id}">
              ${parent.nom} ${parent.prenom} <br>
              ${afficheDate} ${origine}</a></p>`;
  lienHtml += '</div>';
  conteneur.innerHTML += lienHtml;
  const conteneurPersonne = document.getElementById('pageConteneur');
  conteneurPersonne.appendChild(conteneur);
}

// Fonction pour créer le HTML pour un parent (père ou mère)
function afficherCaseVide(containerClass, genderClass) {
  let caseVide = `<div class="${containerClass} ${genderClass}">`;
  caseVide += `<p> </p>`;
  caseVide += '</div>';
  const personContainer = document.getElementById('pageConteneur');
  personContainer.appendChild(caseVide);
}

function afficherParent(fatherId, motherId, containerClass, data) {
  var father = data.find(person => person.id === fatherId);
  var mother = data.find(person => person.id === motherId);
    if (father) {
      const container = afficherPersonne(father, containerClass);
    }
    else {
      const container = afficherCaseVide(containerClass, 'male');
    }
    if (mother) {
      const container = afficherPersonne(mother, containerClass);
    }
    else {
      const container = afficherCaseVide(containerClass, 'female');
    }
}

function creerDate(dateNaissance, dateDeces) {
  const anNaiss = parseInt(dateNaissance.substr(6, 4)); 
  const anDeces = parseInt(dateDeces.substr(6, 4)); 
  if (anNaiss === 1901) {anNaiss = "??"} ;
  if (!anDeces) {
     return anNaiss  }
  else {
    if (anDeces === 1901) {
      anDeces = "??" }
    return anNaiss + '/' + anDeces};
}

function getOrigine(lieuDeNaissance) {
  // Vérification des valeurs nulles, indéfinies ou de type incorrect
  if (!lieuDeNaissance || typeof lieuDeNaissance !== 'string') {
    return ""; 
  }
  const lieuxAcceptes = ["Afrique", "Warrio - Nigéria", "Nigéria", "Madagascar", "Indes", "France"];
  return lieuxAcceptes.includes(lieuDeNaissance) ? `(${lieuDeNaissance})` : "";
}

  
  // Fonction pour créer le HTML pour un parent (père ou mère)
  function creerParentHTML(parent, containerClass, genderClass) {
    let parentHTML = `<div class="${containerClass} ${genderClass}">`;
    parentHTML += `<p><a href="../html/arbrePerso.html?id=${parent.id}" style="text-decoration: none; color: inherit;">${parent.nom} ${parent.prenom}</a></p>`;
    parentHTML += '</div>';
    return parentHTML;
  }
   
 // Fonction pour defifine les id
// Fonction pour trouver une personne par son id 
function trouverPersonneParId(id) {
  return personnes.find(personne => personne.id === id); 
}

// Fonction pour trouver les parents sur plusieurs générations 
function trouverGenerations(personneId) {
  const resultats = [];

  let personne = trouverPersonneParId(personneId);

  // Boucle pour les 5 générations
  for (let i = 0; i < 5; i++) {

    const generation = [];

    // Trouver le père ou mettre un ID 20 si absent
    if (personne.id_pere !== null) {
      const pere = trouverPersonneParId(personne.id_pere) || trouverPersonneParId(20);
      generation.push(personne.id_pere);
      personne = pere;
    } else {
      generation.push(42);  
    }

    // Trouver la mère ou mettre un ID 10 si absente
    if (personne.id_mere !== null) {
      const mere = trouverPersonneParId(personne.id_mere) || trouverPersonneParId(10);
      generation.push(personne.id_mere);
      personne = mere;
    } else {
      generation.push(47);  
    }

    resultats.push(generation);
  }

  return resultats;
}


  
  // Appeler la fonction pour afficher les données
  displayData();
  
  