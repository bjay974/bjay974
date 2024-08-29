  
// Fonction pour afficher les données dans la page
function displayData() {

  var urlParams = new URLSearchParams(window.location.search);
  var personId = urlParams.get('id');
  
  // Charger les données depuis le fichier JSON
  fetch('data.json')
      .then(response => response.json())
      .then(data => {
          // Trouver la personne correspondante
          const person = data.find(p => p.id === parseInt(personId));

          // Afficher les grands-parents
          var gr_mere_mat = trouverGrandMere(person.id_mere, data)
          var gr_pere_mat = trouverGrandPere(person.id_mere, data)
          var gr_mere_pat = trouverGrandMere(person.id_pere, data)
          var gr_pere_pat = trouverGrandPere(person.id_pere, data)
          if (gr_mere_mat || gr_pere_mat || gr_mere_pat || gr_mere_pat) {
          displayGrandParent(gr_pere_pat, gr_mere_pat, gr_pere_mat, gr_mere_mat,'Grands Parents', 'grandparent', data)
          }

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
 
  if (person.id_conjoint > 0){
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


    conjointHTML += '<p><a href="arbrePerso.html?id=' + conjoint.id  + '" style="text-decoration: none; color: inherit;">' + conjoint.nom + ' ' + conjoint.prenom + '</a></p>';;
    conjointHTML += '</div>';
    container.innerHTML += conjointHTML;
}
 
  const personContainer = document.getElementById('person-container');
  personContainer.appendChild(container);
}

function displayGrandParent(father1Id, mother1Id, father2Id, mother2Id, titre, containerClass, data) {

  var container = document.createElement('div');
  container.className = containerClass;
  var father1 = data.find(person => person.id === father1Id);
  var mother1 = data.find(person => person.id === mother1Id);

  if (father1 || mother1){
    var titreLabel = document.createElement('p');
    var titrePat = titre + " Paternels";
    var titrePatSansS = titrePat.replace(/s/g, '');
    if (father1 && mother1) {
      titre.textContent = titrePat;
    } else {
      titre.textContent = titrePatSansS;
    }
    titreLabel.classList.add('label'); 
    container.appendChild(titreLabel);
  }
  if (father1) {
      var pere1HTML = '<div class="' + containerClass + ' male">';
      pere1HTML += '<p><a href="arbrePerso.html?id=' + father1.id  + '" style="text-decoration: none; color: inherit;">' + father1.nom + ' ' + father1.prenom + '</a></p>';
      pere1HTML += '</div>';
      container.innerHTML += pere1HTML;
  }
  if (mother1) {
      var mere1HTML = '<div class="' + containerClass + ' female">';
      mere1HTML += '<p><a href="arbrePerso.html?id=' + mother1.id  + '" style="text-decoration: none; color: inherit;">' + mother1.nom + ' ' + mother1.prenom + '</a></p>';
      mere1HTML += '</div>';
      container.innerHTML += mere1HTML;
  }
  var father2 = data.find(person => person.id === father2Id);
  var mother2 = data.find(person => person.id === mother2Id);
  if (father2 || mother2){
    var titreMat = titre + " Maternels";
    var titreMatSansS = titreMat.replace(/s/g, '');
    var titreLabel = document.createElement('p');
    if (father2 && mother2) {
      titreLabel.textContent = titreMat;
    } else {
      titreLabel.textContent = titreMatSansS;
    }
    titreLabel.classList.add('label'); 
    container.appendChild(titreLabel);
  }
  if (father2) {
      var pere2HTML = '<div class="' + containerClass + ' male">';
      pere2HTML += '<p><a href="arbrePerso.html?id=' + father2.id  + '" style="text-decoration: none; color: inherit;">' + father2.nom + ' ' + father2.prenom + '</a></p>';

      pere2HTML += '</div>';
      container.innerHTML += pere2HTML;
  }
  if (mother2) {
      var mere2HTML = '<div class="' + containerClass + ' female">';
      mere2HTML += '<p><a href="arbrePerso.html?id=' + mother2.id  + '" style="text-decoration: none; color: inherit;">' + mother2.nom + ' ' + mother2.prenom + '</a></p>';
      mere2HTML += '</div>';
      container.innerHTML += mere2HTML;
  }
  const personContainer = document.getElementById('person-container');
      personContainer.appendChild(container);
}

function afficherParent(fatherId, motherId, containerClass, data) {
  var father = data.find(person => person.id === fatherId);
  var mother = data.find(person => person.id === motherId);
  if (father || mother) {
    container = ajouterDivetTitre(containerClass, father && mother, "Parents", "Parent");
    if (father) {
      var pereHTML = '<div class="' + containerClass + ' male">';
      pereHTML += '<p><a href="arbrePerso.html?id=' + father.id  + '" style="text-decoration: none; color: inherit;">' + father.nom + ' ' + father.prenom + '</a></p>';
      pereHTML += '</div>';
      container.innerHTML += pereHTML;
    }
    if (mother) {
      var mereHTML = '<div class="' + containerClass + ' female">';
      mereHTML += '<p><a href="arbrePerso.html?id=' + mother.id  + '" style="text-decoration: none; color: inherit;">' + mother.nom + ' ' + mother.prenom + '</a></p>';
      mereHTML += '</div>';
      container.innerHTML += mereHTML;
    }
    const personContainer = document.getElementById('person-container');
    personContainer.appendChild(container);
  }
}

// Fonction pour afficher les enfants et les petits-enfants
function afficherEnfantsPetitEnfants(parentId, data) {
    // Filtrer les enfants du parent
    var enfants = data.filter(enfant => enfant.id_pere === parentId || enfant.id_mere === parentId);
    // Filtrer les petits-enfants du parent
    var petitsEnfants = [];
    enfants.forEach(function(enfant) {
        var grandEnfant = data.filter(gc => gc.id_pere === enfant.id || gc.id_mere === enfant.id);
        // Ajouter le nom du parent à chaque petit-enfant
        grandEnfant.forEach(gc => gc.parentPrenom = enfant.prenom);
        petitsEnfants.push(...grandEnfant);
      });

  if (enfants.length > 0) {
      container = ajouterDivetTitre('enfant', enfants.length === 1, "Enfant", "Enfants");
      // Afficher les enfants
      enfants.sort((a, b) => b.id - a.id);
      enfants.forEach(function(enfant) {
          var genderClass = enfant.genre === 'M' ? 'male' : 'female';
          var enfantHTML = '<div class="' + 'enfant' + ' ' + genderClass + '">';
          enfantHTML += '<p><a href="arbrePerso.html?id=' + enfant.id  + '" style="text-decoration: none; color: inherit;">' + enfant.nom + ' ' + enfant.prenom + '</a></p>';
          enfantHTML += '</div>';
          container.innerHTML += enfantHTML;
      });
      const personContainer = document.getElementById('person-container');
      personContainer.appendChild(container);
  }

  if (petitsEnfants.length > 0) {
      // Ajouter DIv et un titre
      container = ajouterDivetTitre('petitenfant', grandChildren.length === 1, "Petit-enfant", "Petits-enfants");
      // Afficher les petits-enfants
      petitsEnfants.sort((a, b) => b.id - a.id);
      petitsEnfants.forEach(function(grandEnfant) {
        var genderClass = grandEnfant.genre === 'M' ? 'male' : 'female';
        // Créer le conteneur pour chaque petit-enfant
        var grandEnfantDiv = document.createElement('div');
        grandEnfantDiv.className = 'petitenfant' + ' ' + genderClass;
        // Ajouter le nom et le prénom
        var grandEnfantLink = '<p><a href="arbrePerso.html?id=' + grandEnfant.id + '" style="text-decoration: none; color: inherit;">' 
                          + grandEnfant.nom + ' ' + grandEnfant.prenom + '</a></p>';
        // Ajouter le nom du parent
        var parentInfo = '<p class="parent-info">(' + grandEnfant.parentPrenom + ')</p>';
        // Construire le contenu
        grandEnfantDiv.innerHTML = grandEnfantLink + parentInfo;
        container.appendChild(grandEnfantDiv);
      });
  }
}

function trouverGrandMere(parentId, data) {
  const parent = data.find(person => person.id === parentId);
  if (parent) {
    return parent.id_mere
  }
}

function trouverGrandPere(parentId, data) {
  const parent = data.find(person => person.id === parentId);
  if (parent) {
    return parent.id_pere
  }
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

function ajouterDivetTitre(containerClass, condition, valeur1, valeur2) {
  const container = document.createElement('div');
  container.className = containerClass;
  var titre = document.createElement('p');
  titre.textContent = condition ? valeur1 : valeur2;
  titre.classList.add('label'); 
  container.appendChild(titre);
  return container
}

// Appeler la fonction pour afficher les données
displayData();

