  
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
            displayGrandParent(gr_pere_pat, gr_mere_pat, gr_pere_mat, gr_mere_mat, 'grandparent', data)
            }
            // Afficher les parents
            displayRelations(person.id_pere, person.id_mere, 'parent', data);

            // Afficher les informations de la personne
            displayPersonne(person.id, 'personne', data)
            
            // Afficher les enfants et  petits-enfants
            displayChildrenAndGrandChildren(person.id, 'enfant', data)
        });
}

function displayPersonne(personneId, containerClass, data) {
    // Afficher les informations de la personne
    var person = data.find(person => person.id === personneId);
    var genderClass = person.genre === 'M' ? 'male' : 'female';
    var container = document.createElement('div');
    container.className = containerClass;
    var personHTML = '<div class="' + containerClass + ' ' + genderClass + '">';
    personHTML += '<h4>' + person.nom + ' ' + person.prenom + '</h4>';
    personHTML += '<p>Date de naissance : ' + person.date_naissance + '</p>';
    // Ajouter la date de décès si elle existe
    if (person.date_deces) {
      if (person.date_deces ="01/01/1901") {
        personHTML += '<p>Date de décès inconnue</p>'; }
      else {   
      personHTML += '<p>Date de décès : ' + person.date_deces + '</p>'; }
    }
    personHTML += '</div>';
    container.innerHTML = personHTML;
    const personContainer = document.getElementById('person-container');
    personContainer.appendChild(container);
}

function displayGrandParent(father1Id, mother1Id, father2Id, mother2Id, containerClass, data) {
  var container = document.createElement('div');
  container.className = containerClass;
  var father1 = data.find(person => person.id === father1Id);
  var mother1 = data.find(person => person.id === mother1Id);

  if (father1 || mother1){
    var title = document.createElement('p');
    if (father1 && mother1) {
      title.textContent = "Grands Parents Paternels";
    } else {
      title.textContent = "Grand Parent Paternel";
    }
    title.style.fontStyle = 'italic';
    title.classList.add('label'); 
    container.appendChild(title);
  }
  if (father1) {
      var pere1HTML = '<div class="' + containerClass + ' male">';
      pere1HTML += '<p>' + father1.nom + ' ' + father1.prenom + '</p>';
      pere1HTML += '</div>';
      container.innerHTML += pere1HTML;
  }
  if (mother1) {
      var mere1HTML = '<div class="' + containerClass + ' female">';
      mere1HTML += '<p>' + mother1.nom + ' ' + mother1.prenom + '</p>';
      mere1HTML += '</div>';
      container.innerHTML += mere1HTML;
  }
  var father2 = data.find(person => person.id === father2Id);
  var mother2 = data.find(person => person.id === mother2Id);
  if (father2 || mother2){
    var title = document.createElement('p');
    if (father2 && mother2) {
      title.textContent = "Grands Parents Maternels";
    } else {
      title.textContent = "Grand Parent Maternel";
    }
    title.textContent = "Grand Parent Maternel";
    title.style.fontStyle = 'italic';
    title.classList.add('label'); 
    container.appendChild(title);
  }
  if (father2) {
      var pere2HTML = '<div class="' + containerClass + ' male">';
      pere2HTML += '<p>' + father2.nom + ' ' + father2.prenom + '</p>';
      pere2HTML += '</div>';
      container.innerHTML += pere2HTML;
  }
  if (mother2) {
      var mere2HTML = '<div class="' + containerClass + ' female">';
      mere2HTML += '<p>' + mother2.nom + ' ' + mother2.prenom + '</p>';
      mere2HTML += '</div>';
      container.innerHTML += mere2HTML;
  }
  const personContainer = document.getElementById('person-container');
      personContainer.appendChild(container);
}

function displayRelations(fatherId, motherId, containerClass, data) {
    var father = data.find(person => person.id === fatherId);
    var mother = data.find(person => person.id === motherId);

    if (father || mother) {
        var container = document.createElement('div');
        container.className = containerClass;
        var title = document.createElement('p');
        if (father && mother) {
          title.textContent = "Parents";
        } else {
          title.textContent = "Parent";
        }
        title.textContent = "Parents";
        title.style.fontStyle = 'italic';
        title.classList.add('label'); 
        container.appendChild(title);
    
      if (father ) {
        var pereHTML = '<div class="' + containerClass + ' male">';
        pereHTML += '<p>' + father.nom + ' ' + father.prenom + '</p>';
        pereHTML += '</div>';
        container.innerHTML += pereHTML;
      }
      if (mother ) {
        var mereHTML = '<div class="' + containerClass + ' female">';
        mereHTML += '<p>' + mother.nom + ' ' + mother.prenom + '</p>';
        mereHTML += '</div>';
        container.innerHTML += mereHTML;
      }
      const personContainer = document.getElementById('person-container');
      personContainer.appendChild(container);
    }
}

// Fonction pour afficher les enfants et les petits-enfants
function displayChildrenAndGrandChildren(parentId, containerClass, data) {
  // Filtrer les enfants du parent
  var children = data.filter(child => child.id_pere === parentId || child.id_mere === parentId);
  // Filtrer les petits-enfants du parent
  var grandChildren = [];
  children.forEach(function(child) {
      var grandChild = data.filter(gc => gc.id_pere === child.id || gc.id_mere === child.id);
      grandChildren.push(...grandChild);
  });

  if (children.length > 0) {
      var container = document.createElement('div');
      container.className = containerClass;
      // Ajouter un titre
      var title = document.createElement('p');
      if (children.length === 1) {
        title.textContent = "Enfant";
      } else {
        title.textContent = "Enfants";
      }
      title.style.fontStyle = 'italic';
      title.classList.add('label'); 
      container.appendChild(title);
      // Afficher les enfants
      children.sort((a, b) => b.id - a.id);
      children.forEach(function(child) {
          var genderClass = child.genre === 'M' ? 'male' : 'female';
          var childHTML = '<div class="' + containerClass + ' ' + genderClass + '">';
          childHTML += '<p>' + child.nom + ' ' + child.prenom + '</p>';
          childHTML += '</div>';
          container.innerHTML += childHTML;
      });
  }
  if (grandChildren.length > 0) {
      // Ajouter un titre
      var title = document.createElement('p');
      if (grandChildren.length === 1) {
        title.textContent = "Petit Enfant :";
      } else {
        title.textContent = "Petits Enfants :";
      }
      title.style.fontStyle = 'italic';
      title.classList.add('label'); 
      container.appendChild(title);
      // Afficher les petits-enfants
      grandChildren.sort((a, b) => b.id - a.id);
      grandChildren.forEach(function(grandChild) {
          var genderClass = grandChild.genre === 'M' ? 'male' : 'female';
          var grandChildHTML = '<div class="' + containerClass + ' ' + genderClass + '">';
          grandChildHTML += '<p>' + grandChild.nom + ' ' + grandChild.prenom + '</p>';
          grandChildHTML += '</div>';
          container.innerHTML += grandChildHTML;
      });
  }
  if (grandChildren.length > 0 || children.length > 0) { 
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


  
// Appeler la fonction pour afficher les données
displayData();
  
