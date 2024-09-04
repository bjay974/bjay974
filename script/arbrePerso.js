  
// Fonction pour afficher les données dans la page
function displayData() {

  var urlParams = new URLSearchParams(window.location.search);
  var personId = urlParams.get('id');
  
  // Charger les données depuis le fichier JSON
  fetch('../data/data.json')
      .then(response => response.json())
      .then(data => {
          // Trouver la personne correspondante
          const person = data.find(p => p.id === parseInt(personId));
          // Afficher les grands-parents
          var grand = trouverGrandsParents(person.id_pere, person.id_mere, data);
          afficherGrandParent(
              grand.PerePat, grand.MerePat, grand.PereMat, grand.MereMat,'grandparent', data); 
          // Afficher les parents
          afficherParent(person.id_pere, person.id_mere, 'parent', data);
          // Afficher les informations de la personne
          afficherPersonne(person.id, 'personne', data);
          // Afficher les enfants et  petits-enfants
          afficherEnfantsPetitEnfants(person.id, data);
      });
}

function afficherPersonne(personneId, containerClass, data) {
  // Afficher les informations de la personne
  var person = data.find(person => person.id === personneId);
  var genderClass = person.genre === 'M' ? 'male' : 'female';
  var container = document.createElement('div');
  var icone = '\u{1F476}'
  var personHTML = '<div class="' + containerClass + ' ' + genderClass + '">';
  container.className = containerClass;
  personHTML += '<h4>' + person.nom + ' ' + person.prenom + '</h4>';
  if (person.date_naissance !== "01/01/1901") {
    var dateNaissance = verifieDate(person.date_naissance);
    personHTML += '<p>' + icone + '  ' + dateNaissance + '</p>';
  }
  if (person.date_deces) {
    var dateDeces = verifieDate(person.date_deces);
    icone = '\u{1F64F}'
    if (person.date_deces === "01/01/1901") {
      personHTML += '<p>Date de décès inconnue</p>'; }
    else {   
    personHTML += '<p>' + icone + '  ' +  dateDeces + '</p>'; }
  }
  personHTML += '</div>';
  container.innerHTML += personHTML;
  if (person.id_conjoint){
    var conjoint = data.find(p => p.id === person.id_conjoint);
    var genderconjointClass = conjoint.genre === 'M' ? 'male' : 'female';
    var conjointHTML = '<div class="' + containerClass + ' ' + genderconjointClass + '">';
    var titre = document.createElement('p');
    if (person.date_mariage) {
      if (conjoint.genre === "M") {
        titre.textContent = "Epoux";
      }
      else {
        titre.textContent = "Epouse";
      }
    } else {
      if (conjoint.genre === "M") {
        titre.textContent = "Conjoint";
      }
      else {
        titre.textContent = "Conjointe";
      }
    }
    titre.classList.add('label'); 
    container.appendChild(titre); 
    conjointHTML += '<p><a href="../html/arbrePerso.html?id=' + conjoint.id  + '" style="text-decoration: none; color: inherit;">' + conjoint.nom + ' ' + conjoint.prenom + '</a></p>';;
    conjointHTML += '</div>';
    container.innerHTML += conjointHTML;
  }
  else {
    var genderClass = person.genre === 'M' ? 'female' : 'male';
    container.innerHTML += creerCaseVideHTML(containerClass, 'male');
    let dernierPersonne = document.querySelector('.personne.male:last-child');
    dernierPersonne.classList.add('vide');
  }
   const personContainer = document.getElementById('person-container');
  personContainer.appendChild(container);
}

function afficherGrandParent(father1Id, mother1Id, father2Id, mother2Id, containerClass, data) {
  var father1 = data.find(person => person.id === father1Id);
  var mother1 = data.find(person => person.id === mother1Id);
  var father2 = data.find(person => person.id === father2Id);
  var mother2 = data.find(person => person.id === mother2Id);
  let container;
  if ((father1 !== 'inconnu') || (mother1 !== 'inconnue') || (father2 !== 'inconnu') || (mother2 !== 'inconnue')) {
    container = ajouterDivetTitre(containerClass, (father1 && mother1) || (father2 && mother2) , "Grands-parent", "Grand-parents");
   
    if (father1 && father1 !== 'inconnu')
       {  container.innerHTML += creerParentHTML(father1, containerClass, 'male');
    } else 
      {container.innerHTML += creerCaseVideHTML(containerClass, 'male');
    }
    if (mother1 && mother1 !== 'inconnu') {
      container.innerHTML += creerParentHTML(mother1, containerClass, 'female');
    } else 
      {container.innerHTML += creerCaseVideHTML(containerClass, 'female');
    }
    if (father2 && father2 !== 'inconnu') {
      container.innerHTML += creerParentHTML(father2, containerClass, 'male');
    } else 
      {container.innerHTML += creerCaseVideHTML(containerClass, 'male');
    }
    if (mother2 && mother2 !== 'inconnu') {
      container.innerHTML += creerParentHTML(mother2, containerClass, 'female');
    } else 
      {container.innerHTML += creerCaseVideHTML(containerClass, 'female');
    }

    const personContainer = document.getElementById('person-container');
    personContainer.appendChild(container);
  }
}

function trouverGrandsParents(pereId, mereId, data) {
  // Trouver les parents dans les données
  const pere = data.find(person => person.id === pereId);
  const mere = data.find(person => person.id === mereId);
  // Initialiser un objet avec des propriétés définies par défaut
  const result = { PerePat: null, MerePat: null, PereMat:null, MereMat:null };
  if (pere) {
    // Vérifier si id_pere et id_mere sont des entiers valides
    if (Number.isInteger(pere.id_pere)) {
      result.PerePat = pere.id_pere;
    }
    if (Number.isInteger(pere.id_mere)) {
      result.MerePat = pere.id_mere;
  } }
  if (mere) {
      // Vérifier si id_pere et id_mere sont des entiers valides
      if (Number.isInteger(mere.id_pere)) {
        result.PereMat = mere.id_pere;
      }
      if (Number.isInteger(mere.id_mere)) {
        result.MereMat = mere.id_mere;
  } }
  return result;
}

function afficherParent(fatherId, motherId, containerClass, data) {
  var father = data.find(person => person.id === fatherId);
  var mother = data.find(person => person.id === motherId);
    container = ajouterDivetTitre(containerClass, father && mother === true, "Parent", "Parents");
    if (father) {
      container.innerHTML += creerParentHTML(father, containerClass, 'male');
    }
    else {
      container.innerHTML += creerCaseVideHTML(containerClass, 'male');
    }
    if (mother) {
      container.innerHTML += creerParentHTML(mother, containerClass, 'female');
    }
    else {
      container.innerHTML += creerCaseVideHTML(containerClass, 'female');
    }
    const personContainer = document.getElementById('person-container');
    personContainer.appendChild(container);
}

function afficherEnfantsPetitEnfants(parentId, data) {
  const enfants = data.filter(enfant => enfant.id_pere === parentId || enfant.id_mere === parentId);
  if (enfants.length > 0) {
      // Conteneur global pour tous les enfants et petits-enfants
      const globalContainer = document.createElement('div');
      globalContainer.className = 'global-container';
      enfants.sort((a, b) => b.id - a.id);
      let labelPetitEnfantAdded = false;
      let labelEnfantAdded = false;
      enfants.forEach(enfant => {
          // Conteneur pour chaque enfant et ses petits-enfants
          const enfantContainer = document.createElement('div');
          enfantContainer.className = 'enfant-container';
          if (!labelEnfantAdded) {
              // Ajouter un label "Enfant" avant le premier enfant
              const labelEnfant = document.createElement('p');
              labelEnfant.textContent = enfants.length === 1 ? "Enfant" : "Enfants";
              labelEnfant.classList.add('label');
              labelEnfant.classList.add('enfant-container');
              globalContainer.appendChild(labelEnfant);
              labelEnfantAdded = true;
          }
          // Ajouter l'enfant au conteneur
          afficherMembreDansConteneur(enfant, enfantContainer, 'enfant');
          // Conteneur pour les petits-enfants
          const petitsEnfants = data.filter(gc => gc.id_pere === enfant.id || gc.id_mere === enfant.id);
          if (petitsEnfants.length > 0) {
             const petitsEnfantsContainer = document.createElement('div');
             petitsEnfantsContainer.className = 'petits-enfants-container';
             
              // Ajouter un label "Petit(s) Enfant(s)" avant le premier petit-enfant
              if (!labelPetitEnfantAdded) {
                  const labelPetitEnfant = document.createElement('p');
                  labelPetitEnfant.textContent = "Petit(s) Enfant(s)";
                  labelPetitEnfant.classList.add('label');
                  labelPetitEnfant.classList.add('petits-enfants-container');
                  globalContainer.appendChild(labelPetitEnfant);
                  labelPetitEnfantAdded = true;
              }
              petitsEnfants.sort((a, b) => b.id - a.id);
              petitsEnfants.forEach(petitEnfant => {
                  afficherMembreDansConteneur(petitEnfant, petitsEnfantsContainer, 'petitenfant');
              });
              // Ajouter les petits-enfants au conteneur de l'enfant
              enfantContainer.appendChild(petitsEnfantsContainer);
          }
          // Ajouter l'enfant (et ses petits-enfants) au conteneur global
          globalContainer.appendChild(enfantContainer);
      });
      // Ajouter le conteneur global au conteneur principal
      document.getElementById('person-container').appendChild(globalContainer);
  }
}

// Fonction pour afficher un membre (enfant ou petit-enfant) dans un conteneur donné
function afficherMembreDansConteneur(membre, conteneur, role) {
  const genderClass = membre.genre === 'M' ? 'male' : 'female';
  const membreDiv = document.createElement('div');
  membreDiv.className = `${role} ${genderClass} membre-container`;
  const membreLink = `<p><a href="../html/arbrePerso.html?id=${membre.id}" style="text-decoration: none; color: inherit;">${membre.nom} ${membre.prenom}</a></p>`;
  membreDiv.innerHTML = membreLink;
  conteneur.appendChild(membreDiv);
}


// Fonction générique pour afficher les membres
function afficherMembres(titreSingulier, titrePluriel, membres, cssClass, parentPrenom = null) {
  const container = ajouterDivetTitre(cssClass, membres.length === 1, titreSingulier, titrePluriel);
    membres.forEach(membre => {
      const genderClass = membre.genre === 'M' ? 'male' : 'female';
      const membreDiv = document.createElement('div');
      membreDiv.className = `${cssClass} ${genderClass}`;
      
      const membreLink = `<p><a href="../html/arbrePerso.html?id=${membre.id}" style="text-decoration: none; color: inherit;">${membre.nom} ${membre.prenom}</a></p>`;
      
      membreDiv.innerHTML = parentPrenom ? membreLink + `<p class="parent-info">(${parentPrenom})</p>` : membreLink;
      container.appendChild(membreDiv);
  });
    document.getElementById('person-container').appendChild(container);
}

// Fonction pour ajouter un div avec un titre
function ajouterDivetTitre(containerClass, condition, titreSingulier, titrePluriel) {
  const container = document.createElement('div');
  container.className = containerClass;
  const titre = document.createElement('p');
  titre.textContent = condition ? titreSingulier : titrePluriel;
  titre.classList.add('label'); 
  container.appendChild(titre);
  return container;
}

//Verifie si la date est connue  
function verifieDate(date) {
  const an = parseInt(date.substr(6, 4));
  const mois = parseInt(date.substr(3, 2));
  const day = parseInt(date.substr(0, 2));
  if (day === 1 && mois === 1) {
    return "en " + an;
  } else {
      return "le " + date;
  }
}

// Fonction pour créer le HTML pour un parent (père ou mère)
function creerParentHTML(parent, containerClass, genderClass) {
  let parentHTML = `<div class="${containerClass} ${genderClass}">`;
  parentHTML += `<p><a href="../html/arbrePerso.html?id=${parent.id}" style="text-decoration: none; color: inherit;">${parent.nom} ${parent.prenom}</a></p>`;
  parentHTML += '</div>';
  return parentHTML;
}

// Fonction pour créer le HTML pour un parent (père ou mère)
function creerCaseVideHTML(containerClass, genderClass) {
  let parentHTML = `<div class="${containerClass} ${genderClass}">`;
  parentHTML += `<p> </p>`;
  parentHTML += '</div>';
  return parentHTML;
}


// Appeler la fonction pour afficher les données
displayData();

