// Fonction pour afficher les données dans la page
function afficherData() {

  let urlParams = new URLSearchParams(window.location.search);
  let personId = urlParams.get('id');
  
  // Charger les données depuis le fichier JSON
  fetch('data.json')
      .then(response => response.json())
      .then(data => {
          // Trouver la personne correspondante
          const person = data.find(p => p.id === parseInt(personId));

          // Afficher les grands-parents
          const gr_mere_mat = trouverGrandMere(person.id_mere, data)
          const gr_pere_mat = trouverGrandPere(person.id_mere, data)
          const gr_mere_pat = trouverGrandMere(person.id_pere, data)
          const gr_pere_pat = trouverGrandPere(person.id_pere, data)
          if (gr_mere_mat || gr_pere_mat || gr_mere_pat || gr_mere_pat) {
          afficherGrandParent(gr_pere_pat, gr_mere_pat, gr_pere_mat, gr_mere_mat,'Grands Parents', 'grandparent', data)
          }

          // Afficher les parents
          afficherParents(person.id_pere, person.id_mere, 'parent', data);

          // Afficher les informations de la personne
          afficherPersonne(person.id, 'personne', person)
          
          // Afficher les enfants et  petits-enfants
          afficherEnfantetPetitenfant(person.id, 'enfant', data)
      });
}

function afficherPersonne(personneId, containerClass, person) {
  // Afficher les informations de la personne
  const genderClass = person.genre === 'M' ? 'male' : 'female';
  const container = creerDiv(containerClass)
  const icone = '\u{1F476}'
  const personHTML = '<div class="' + containerClass + ' ' + genderClass + '">';
  personHTML += '<h4>' + person.nom + ' ' + person.prenom + '</h4>';
  if (person.date_naissance !== "01/01/1901") {
    const dateNaissance = verifierDate(person.date_naissance);
    personHTML += '<p>' + icone + '  ' + dateNaissance + '</p>';
  }
  if (person.date_deces) {
    const dateDeces = verifierDate(person.date_deces);
    icone = '\u{1F64F}'
    if (person.date_deces === "01/01/1901") {
      personHTML += '<p>Date de décès inconnue</p>'; }
    else {   
    personHTML += '<p>' + icone + '  ' +  dateDeces + '</p>'; }
  }
  personHTML += '</div>';
  container.innerHTML += personHTML;
  if (person.id_conjoint > 0){
    const conjoint = data.find(p => p.id === person.id_conjoint);
    const genderconjointClass = conjoint.genre === 'M' ? 'male' : 'female';
    const conjointHTML = '<div class="' + containerClass + ' ' + genderconjointClass + '">';
    const title = document.createElement('p');
    if (person.date_mariage) {
      if (conjoint.genre === "M") {
        title.textContent = "Epoux";
      }
      else {
        title.textContent = "Epouse";
      }
    } else {
      if (conjoint.genre === "M") {
        title.textContent = "Conjoint";
      }
      else {
        title.textContent = "Conjointe";
      }
    }
    title.classList.add('label'); 
    container.appendChild(title); 


    conjointHTML += '<p><a href="arbrePerso.html?id=' + conjoint.id  + '" style="text-decoration: none; color: inherit;">' + conjoint.nom + ' ' + conjoint.prenom + '</a></p>';;
    conjointHTML += '</div>';
    container.innerHTML += conjointHTML;
}
 
  const personContainer = document.getElementById('person-container');
  personContainer.appendChild(container);
}

function afficherGrandParent(father1Id, mother1Id, father2Id, mother2Id, titre, containerClass, data) {

  const container = creerDiv(containerClass);
  const father1 = data.find(person => person.id === father1Id);
  const mother1 = data.find(person => person.id === mother1Id);

  if (father1 || mother1){
    const title = document.createElement('p');
    const titrePat = titre + " Paternels";
    const titrePatSansS = titrePat.replace(/s/g, '');
    if (father1 && mother1) {
      title.textContent = titrePat;
    } else {
      title.textContent = titrePatSansS;
    }
    title.classList.add('label'); 
    container.appendChild(title);
  }
  if (father1) {
    const pere1HTML = '<div class="' + containerClass + ' male">';
      pere1HTML += '<p><a href="arbrePerso.html?id=' + father1.id  + '" style="text-decoration: none; color: inherit;">' + father1.nom + ' ' + father1.prenom + '</a></p>';
      pere1HTML += '</div>';
      container.innerHTML += pere1HTML;
  }
  if (mother1) {
    const mere1HTML = '<div class="' + containerClass + ' female">';
      mere1HTML += '<p><a href="arbrePerso.html?id=' + mother1.id  + '" style="text-decoration: none; color: inherit;">' + mother1.nom + ' ' + mother1.prenom + '</a></p>';
      mere1HTML += '</div>';
      container.innerHTML += mere1HTML;
  }
  const father2 = data.find(person => person.id === father2Id);
  const mother2 = data.find(person => person.id === mother2Id);
  if (father2 || mother2){
    const titreMat = titre + " Maternels";
    const titreMatSansS = titreMat.replace(/s/g, '');
    const title = document.createElement('p');
    if (father2 && mother2) {
      title.textContent = titreMat;
    } else {
      title.textContent = titreMatSansS;
    }
    title.classList.add('label'); 
    container.appendChild(title);
  }
  if (father2) {
    const pere2HTML = '<div class="' + containerClass + ' male">';
      pere2HTML += '<p><a href="arbrePerso.html?id=' + father2.id  + '" style="text-decoration: none; color: inherit;">' + father2.nom + ' ' + father2.prenom + '</a></p>';

      pere2HTML += '</div>';
      container.innerHTML += pere2HTML;
  }
  if (mother2) {
    const mere2HTML = '<div class="' + containerClass + ' female">';
      mere2HTML += '<p><a href="arbrePerso.html?id=' + mother2.id  + '" style="text-decoration: none; color: inherit;">' + mother2.nom + ' ' + mother2.prenom + '</a></p>';
      mere2HTML += '</div>';
      container.innerHTML += mere2HTML;
  }
  const personContainer = document.getElementById('person-container');
      personContainer.appendChild(container);
  }

function afficherParents(fatherId, motherId, containerClass, data) {
  const father = data.find(person => person.id === fatherId);
  const mother = data.find(person => person.id === motherId);
    if (father || mother) {
      const container = creerDiv(containerClass)
      const title = document.createElement('p');
      if (father && mother) {
        title.textContent = "Parents";
      } else {
        title.textContent = "Parent";
      }
      title.textContent = "Parents";
      title.classList.add('label'); 
      container.appendChild(title);
    
      if (father) {
        const pereHTML = '<div class="' + containerClass + ' male">';
        pereHTML += '<p><a href="arbrePerso.html?id=' + father.id  + '" style="text-decoration: none; color: inherit;">' + father.nom + ' ' + father.prenom + '</a></p>';
        pereHTML += '</div>';
        container.innerHTML += pereHTML;
      }
      if (mother) {
        const mereHTML = '<div class="' + containerClass + ' female">';
        mereHTML += '<p><a href="arbrePerso.html?id=' + mother.id  + '" style="text-decoration: none; color: inherit;">' + mother.nom + ' ' + mother.prenom + '</a></p>';
        mereHTML += '</div>';
        container.innerHTML += mereHTML;
      }
      const personContainer = document.getElementById('person-container');
      personContainer.appendChild(container);
    }
}

// Fonction pour afficher les enfants et les petits-enfants
function afficherEnfantetPetitenfant(parentId, containerClass, data) {

  // Filtrer les enfants du parent
  const enfant = data.filter(child => child.id_pere === parentId || child.id_mere === parentId);
  // Filtrer les petits-enfants du parent
  const grandenfant = [];
  enfant.forEach(function(child) {
    const grandChild = data.filter(gc => gc.id_pere === child.id || gc.id_mere === child.id);
    // Ajouter le nom du parent à chaque petit-enfant
    grandChild.forEach(gc => gc.parentPrenom = child.prenom);
    grandenfant.push(...grandChild);
  });

  if (enfant.length > 0) {
      const container = creerDiv(containerClass);
      // Ajouter un titre
      const title = document.createElement('p');
      title.textContent = enfant.length === 1 ? "Enfant" : "Enfants";
      title.classList.add('label'); 
      container.appendChild(title);
      // Afficher les enfants
      enfant.sort((a, b) => b.id - a.id);
      enfant.forEach(function(child) {
        const genderClass = child.genre === 'M' ? 'male' : 'female';
        const childHTML = '<div class="' + containerClass + ' ' + genderClass + '">';
          childHTML += '<p><a href="arbrePerso.html?id=' + child.id  + '" style="text-decoration: none; color: inherit;">' + child.nom + ' ' + child.prenom + '</a></p>';
          childHTML += '</div>';
          container.innerHTML += childHTML;
      });
      const personContainer = document.getElementById('person-container');
      personContainer.appendChild(container);
  }

  if (grandenfant.length > 0) {
      // Ajouter un titre
      const container = creerDiv('grandenfant')
      const title = document.createElement('p');
      title.textContent = enfant.length === 1 ? "Petit enfant" : "Petits enfants";
      title.classList.add('label'); 
      container.appendChild(title);
      // Afficher les petits-enfants
      grandenfant.sort((a, b) => b.id - a.id);
      grandenfant.forEach(function(grandChild) {
        const genderClass = grandChild.genre === 'M' ? 'male' : 'female';
        const grandChildHTML = '<div class="' + 'grandenfant' + ' ' + genderClass + '">';
        grandChildHTML += '<p><a href="arbrePerso.html?id=' + grandChild.id  + '" style="text-decoration: none; color: inherit;">' + grandChild.nom + ' ' + grandChild.prenom + '</a>';
        grandChildHTML += ' <span style="font-size: smaller; font-style: italic;">(' + grandChild.parentPrenom + ')</span></p>';
        grandChildHTML += '</div>';
        container.innerHTML += grandChildHTML;
      });
      const personContainer = document.getElementById('person-container');
      personContainer.appendChild(container);
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
function verifierDate(date) {
  const an = parseInt(date.substr(6, 4));
  const mois = parseInt(date.substr(3, 2));
  const day = parseInt(date.substr(0, 2));
  if (day === 1 && mois === 1) {
    return "en " + an;
  } else {
      return "le " + date;
  }
}

function creerDiv(classConteneur) {
  var div = document.createElement('div');
  div.className = classConteneur;
  return div;
}

// Appeler la fonction pour afficher les données
afficherData();
