function afficherData() {
  let urlParams = new URLSearchParams(window.location.search);
  let personId = parseInt(urlParams.get('id'));
  // Charge les données depuis le fichier JSON
  fetch('data.json')
      .then(response => response.json())
      .then(data => {
          // IDs des personnes à récupérer
          const ids = [
              personId, 
              trouverIdParent(personId, data, 'pere'), 
              trouverIdParent(personId, data, 'mere')
          ];
          // Ajout des grands-parents à la liste des IDs à récupérer
          const id_pere = ids[1];
          const id_mere = ids[2];
          if (id_pere) {
              ids.push(trouverIdParent(id_pere, data, 'pere'));
              ids.push(trouverIdParent(id_pere, data, 'mere'));
          }
          if (id_mere) {
              ids.push(trouverIdParent(id_mere, data, 'pere'));
              ids.push(trouverIdParent(id_mere, data, 'mere'));
          }
           
          // Ajouter les enfants et petits-enfants
            const enfants = data.filter(child => child.id_pere === personId || child.id_mere === personId);
            enfants.forEach(enfant => {
                ids.add(enfant.id);
                const petitsEnfants = data.filter(gc => gc.id_pere === enfant.id || gc.id_mere === enfant.id);
                petitsEnfants.forEach(pe => ids.add(pe.id));
          });

          // Centraliser les recherches pour les IDs
          const personnes = centraliserRecherches(ids, data);

          // Afficher les informations de la personne
          afficherPersonne(personnes[personId]);

          // Afficher les parents
          afficherRelations(personnes[id_pere], personnes[id_mere]);

          // Afficher les grands-parents
          afficherGrandsParents(personnes, data);

          // Afficher les enfants et les petits-enfants
          afficherEnfantetPetitenfant(personnes, enfants, data);
      });
}
function afficherPersonne(person, data) {
    // Afficher les informations de la personne
    if (!person) return;
    const containerClass = 'personne'
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
      const conjoint = trouverPersonneParId(person.id_conjoint, data);
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

function afficherGrandsParents(personnes) {
  const containerClass = 'grandparent'
  const container = creerDiv(containerClass);
  const titre = "Grands Parents";
  const gr_mere_mat = personnes[trouverIdParent(personnes[personne.id_mere].id_mere, personnes)];
  const gr_pere_mat = personnes[trouverIdParent(personnes[personne.id_mere].id_pere, personnes)];
  const gr_mere_pat = personnes[trouverIdParent(personnes[personne.id_pere].id_mere, personnes)];
  const gr_pere_pat = personnes[trouverIdParent(personnes[personne.id_pere].id_pere, personnes)];

  const grandParents = [
      { id: gr_pere_mat, genre: 'M', title: `${titre} Paternels` },
      { id: gr_pere_pat, genre: 'F', title: `${titre} Paternels` },
      { id: gr_mere_pat, genre: 'M', title: `${titre} Maternels` },
      { id: gr_mere_mat, genre: 'F', title: `${titre} Maternels` }
  ];
  grandParents.forEach(grandParent => {
          const personHTML = `
              <div class="${containerClass} ${grandParent.genre === 'M' ? 'male' : 'female'}">
                  <p><a href="arbrePerso.html?id=${person.id}" style="text-decoration: none; color: inherit;">${person.nom} ${person.prenom}</a></p>
              </div>`;
          container.innerHTML += personHTML;
  });
  const personContainer = document.getElementById('person-container');
  personContainer.appendChild(container);
}

function afficherRelations(father, mother) {
  if (father || mother) {
      const relations = [
          { id: father, genre: 'M' },
          { id: mother, genre: 'F' }
      ];
      const containerClass = 'parent'
      const container = creerDiv(containerClass);
      const title = document.createElement('p');
      title.textContent = relations.filter(r => r.id).length > 1 ? "Parents" : "Parent";
      title.classList.add('containerClass'); 
      container.appendChild(title);

      relations.forEach(relation => {
              const personHTML = `
                  <div class="${containerClass} ${relation.genre === 'M' ? 'male' : 'female'}">
                      <p><a href="arbrePerso.html?id=${person.id}" style="text-decoration: none; color: inherit;">${person.nom} ${person.prenom}</a></p>
                  </div>`;
              container.innerHTML += personHTML;
      });

      const personContainer = document.getElementById('person-container');
      personContainer.appendChild(container);
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

function trouverPersonneParId(id, data) {
  return data.find(person => person.id === id);
}

function trouverIdParent(personId, data, type) {
  const person = data.find(p => p.id === personId);
  if (type === 'pere') return person?.id_pere;
  if (type === 'mere') return person?.id_mere;
  return null;
}


function centraliserRecherches(ids, data) {
  const personnes = {};
  // Parcourt les données pour trouver les personnes correspondant aux IDs
  data.forEach(person => {
      if (ids.includes(person.id)) {
          personnes[person.id] = person;
      }
  });
  return personnes;
}

function afficherEnfantetPetitenfant(personnes, enfants ,data) {
  if (enfants.length > 0) {
      const container = creerDiv('enfant');
      const title = document.createElement('p');
      title.textContent = enfants.length === 1 ? "Enfant" : "Enfants";
      title.classList.add('label'); 
      container.appendChild(title);

      // Afficher les enfants
      enfants.sort((a, b) => b.id - a.id);
      enfants.forEach(function(enfant) {
          const genderClass = enfant.genre === 'M' ? 'male' : 'female';
          const enfantHTML = '<div class="enfant ' + genderClass + '">';
          enfantHTML += '<p><a href="arbrePerso.html?id=' + enfant.id + '" style="text-decoration: none; color: inherit;">' + enfant.nom + ' ' + enfant.prenom + '</a></p>';
          enfantHTML += '</div>';
          container.innerHTML += enfantHTML;
      });

      const personContainer = document.getElementById('person-container');
      personContainer.appendChild(container);

      // Afficher les petits-enfants
      const grandenfants = enfants.flatMap(enfant => 
          data.filter(gc => gc.id_pere === enfant.id || gc.id_mere === enfant.id)
      );

      if (grandenfants.length > 0) {
          const container = creerDiv('grandenfant');
          const title = document.createElement('p');
          title.textContent = grandenfants.length === 1 ? "Petit-enfant" : "Petits-enfants";
          title.classList.add('label');
          container.appendChild(title);

          grandenfants.sort((a, b) => b.id - a.id);
          grandenfants.forEach(function(grandEnfant) {
              const genderClass = grandEnfant.genre === 'M' ? 'male' : 'female';
              const grandEnfantHTML = '<div class="grandenfant ' + genderClass + '">';
              grandEnfantHTML += '<p><a href="arbrePerso.html?id=' + grandEnfant.id + '" style="text-decoration: none; color: inherit;">' + grandEnfant.nom + ' ' + grandEnfant.prenom + '</a>';
              grandEnfantHTML += ' <span style="font-size: smaller; font-style: italic;">(' + personnes[grandEnfant.id].prenom + ')</span></p>';
              grandEnfantHTML += '</div>';
              container.innerHTML += grandEnfantHTML;
          });

          personContainer.appendChild(container);
      }
  }
}

// Appeler la fonction pour afficher les données
afficherData();
  
