function afficherData() {
  let urlParams = new URLSearchParams(window.location.search);
  let personId = parseInt(urlParams.get('id'));

  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      const ids = new Set([personId]);

      // Ajouter les ancêtres (niveau 1 pour parents et 2 pour grands-parents)
      ajouterAncetres(ids, personId, data, 2);

      // Ajouter les enfants et petits-enfants
      const enfants = data.filter(child => child.id_pere === personId || child.id_mere === personId);
      enfants.forEach(enfant => {
        ids.add(enfant.id);
      const petitsEnfants = data.filter(gc => gc.id_pere === enfant.id || gc.id_mere === enfant.id);
        petitsEnfants.forEach(pe => ids.add(pe.id));
      });

      // Centraliser les recherches pour les IDs
      const personnes = centraliserRecherches([...ids], data);

      // Afficher les informations
      afficherPersonne(personnes[personId], personnes);
      afficherParents(personnes[trouverIdParent(personId, data, 'pere')], personnes[trouverIdParent(personId, data, 'mere')]);
      afficherEnfantetPetitenfant(personnes, enfants, petitsEnfants, data);
      afficherGrandsParents(personnes, personId, data);
    });
}

function afficherPersonne(person, personnes) {
  if (!person) return;
  const containerClass = 'personne';
  const genderClass = person.genre === 'M' ? 'male' : 'female';
  let personHTML = `<div class="${containerClass} ${genderClass}">
                      <h4>${person.nom} ${person.prenom}</h4>`;

  if (person.date_naissance !== "01/01/1901") {
    const dateNaissance = verifierDate(person.date_naissance);
    personHTML += `<p>\u{1F476} ${dateNaissance}</p>`;
  }
  if (person.date_deces) {
    const dateDeces = verifierDate(person.date_deces);
    const icone = '\u{1F64F}';
    personHTML += `<p>${icone} ${dateDeces !== "01/01/1901" ? dateDeces : "Date de décès inconnue"}</p>`;
  }
  personHTML += `</div>`;

  if (person.id_conjoint > 0) {
    const conjoint = personnes[person.id_conjoint];
    if (conjoint) {
      const genderConjointClass = conjoint.genre === 'M' ? 'male' : 'female';
      const titreConjoint = person.date_mariage ? (conjoint.genre === 'M' ? "Epoux" : "Epouse") : (conjoint.genre === 'M' ? "Conjoint" : "Conjointe");
      personHTML += `<div class="${containerClass} ${genderConjointClass}">
                       <p class="label">${titreConjoint}</p>
                       <p><a href="arbrePerso.html?id=${conjoint.id}" style="text-decoration: none; color: inherit;">${conjoint.nom} ${conjoint.prenom}</a></p>
                     </div>`;
    }
  }
  const container = creerDiv(containerClass);
  container.innerHTML = personHTML;
  document.getElementById('person-container').appendChild(container);
}

function afficherGrandsParents(grandsParentsids, personId, data) {
  const containerClass = 'grandparent';
  const container = creerDiv(containerClass);
  container.innerHTML = `<p class="label">Grands Parents</p>`;
  
  const id_mere = trouverIdParent(personId, data, 'mere');
  const id_pere = trouverIdParent(personId, data, 'pere');
  
  const grandParents = [
    { person: personnes[trouverIdParent(id_mere, data, 'mere')], genre: 'F' },
    { person: personnes[trouverIdParent(id_mere, data, 'pere')], genre: 'M' },
    { person: personnes[trouverIdParent(id_pere, data, 'mere')], genre: 'F' },
    { person: personnes[trouverIdParent(id_pere, data, 'pere')], genre: 'M' }
  ];

  grandParents.forEach(gp => {
    if (gp.person) {
      container.innerHTML += `<div class="${containerClass} ${gp.genre === 'M' ? 'male' : 'female'}">
                                 <p><a href="arbrePerso.html?id=${gp.person.id}" style="text-decoration: none; color: inherit;">${gp.person.nom} ${gp.person.prenom}</a></p>
                              </div>`;
    }
  });

  document.getElementById('person-container').appendChild(container);
}

function afficherParents(father, mother) {
  if (father || mother) {
    const containerClass = 'parent';
    const container = creerDiv(containerClass);
    const titleText = (father && mother) ? "Parents" : "Parent";
    container.innerHTML = `<p class="label">${titleText}</p>`;

    [father, mother].forEach(parent => {
      if (parent) {
        const genderClass = parent.genre === 'M' ? 'male' : 'female';
        container.innerHTML += `<div class="${containerClass} ${genderClass}">
                                  <p><a href="arbrePerso.html?id=${parent.id}" style="text-decoration: none; color: inherit;">${parent.nom} ${parent.prenom}</a></p>
                                </div>`;
      }
    });

    document.getElementById('person-container').appendChild(container);
  }
}

function verifierDate(date) {
  const [day, month, year] = date.split('/').map(Number);
  return (day === 1 && month === 1) ? `en ${year}` : `le ${day}/${month}/${year}`;
}

function creerDiv(classConteneur) {
  const div = document.createElement('div');
  div.className = classConteneur;
  return div;
}

function trouverPersonneParId(id, data) {
  return data.find(person => person.id === id);
}

function trouverIdParent(personId, data, type) {
  const person = data.find(p => p.id === personId);
  return type === 'pere' ? person?.id_pere : person?.id_mere;
}

function centraliserRecherches(ids, data) {
  const personnes = {};
  data.forEach(person => {
    if (ids.includes(person.id)) {
      personnes[person.id] = person;
    }
  });
  return personnes;
}

function afficherEnfantetPetitenfant(enfants, petitsEnfants, data) {
  if (enfants.length > 0) {
    const container = creerDiv('enfant');
    const title = enfants.length === 1 ? "Enfant" : "Enfants";
    container.innerHTML = `<p class="label">${title}</p>`;

    enfants.forEach(enfant => {
      const genderClass = enfant.genre === 'M' ? 'male' : 'female';
      container.innerHTML += `<div class="enfant ${genderClass}">
                                <p><a href="arbrePerso.html?id=${enfant.id}" style="text-decoration: none; color: inherit;">${enfant.nom} ${enfant.prenom}</a></p>
                              </div>`;
    });

    document.getElementById('person-container').appendChild(container);

    if (petitsEnfants.length > 0) {
      const container = creerDiv('grandenfant');
      const title = grandenfants.length === 1 ? "Petit-enfant" : "Petits-enfants";
      container.innerHTML = `<p class="label">${title}</p>`;

      grandenfants.forEach(grandEnfant => {
        const genderClass = grandEnfant.genre === 'M' ? 'male' : 'female';
        container.innerHTML += `<div class="grandenfant ${genderClass}">
                                  <p><a href="arbrePerso.html?id=${grandEnfant.id}" style="text-decoration: none; color: inherit;">${grandEnfant.nom} ${grandEnfant.prenom}</a></p>
                                </div>`;
      });

      document.getElementById('person-container').appendChild(container);
    }
  }
}

function ajouterGrandsParents(ids, data) {
  const grandsParents = new Set();
  
  ids.forEach(id => {
    const pereId = trouverIdParent(id, data, 'pere');
    const mereId = trouverIdParent(id, data, 'mere');
    
    if (pereId) {
      grandsParents.add(trouverIdParent(pereId, data, 'pere'));
      grandsParents.add(trouverIdParent(pereId, data, 'mere'));
    }
    if (mereId) {
      grandsParents.add(trouverIdParent(mereId, data, 'pere'));
      grandsParents.add(trouverIdParent(mereId, data, 'mere'));
    }
  });
  grandsParents.forEach(grandParentId => ids.add(grandParentId));
  return grandsParents
}

function ajouterAncetres(ids, idPersonne, data, niveau) {
  if (niveau === 0) return; // Limiter la profondeur (niveau 0 pour les parents, 1 pour les grands-parents)

  // Ajouter les parents
  const addParentIds = (id) => {
    const pereId = trouverIdParent(id, data, 'pere');
    const mereId = trouverIdParent(id, data, 'mere');
    if (pereId) ids.add(pereId);
    if (mereId) ids.add(mereId);
    return [pereId, mereId];
  };

  const [pereId, mereId] = addParentIds(idPersonne);

  // Appel récursif pour les grands-parents
  if (niveau > 0) {
    if (pereId) ajouterAncetres(ids, pereId, data, niveau - 1);
    if (mereId) ajouterAncetres(ids, mereId, data, niveau - 1);
  }
}

function afficherGrandsParents(personnes, personId, data) {
  const containerClass = 'grandparent';
  const container = creerDiv(containerClass);
  container.innerHTML = `<p class="label">Grands Parents</p>`;
  
  // Trouver les grands-parents pour l'identifiant donné
  const id_mere = trouverIdParent(personId, data, 'mere');
  const id_pere = trouverIdParent(personId, data, 'pere');

  const grandsParentsIds = new Set();
  if (id_mere) {
    const [id_gr_pere_mere, id_gr_mere_mere] = trouverIdParent(id_mere, data, 'pere');
    const [id_gr_pere_pere, id_gr_mere_pere] = trouverIdParent(id_mere, data, 'mere');
    grandsParentsIds.add(id_gr_pere_mere);
    grandsParentsIds.add(id_gr_mere_mere);
    grandsParentsIds.add(id_gr_pere_pere);
    grandsParentsIds.add(id_gr_mere_pere);
  }
  if (id_pere) {
    const [id_gr_pere_mere, id_gr_mere_mere] = trouverIdParent(id_pere, data, 'pere');
    const [id_gr_pere_pere, id_gr_mere_pere] = trouverIdParent(id_pere, data, 'mere');
    grandsParentsIds.add(id_gr_pere_mere);
    grandsParentsIds.add(id_gr_mere_mere);
    grandsParentsIds.add(id_gr_pere_pere);
    grandsParentsIds.add(id_gr_mere_pere);
  }

  grandsParentsIds.forEach(grandParentId => {
    const person = personnes[grandParentId];
    if (person) {
      container.innerHTML += `<div class="${containerClass} ${person.genre === 'M' ? 'male' : 'female'}">
                               <p><a href="arbrePerso.html?id=${person.id}" style="text-decoration: none; color: inherit;">${person.nom} ${person.prenom}</a></p>
                            </div>`;
    }
  });
}



afficherData();