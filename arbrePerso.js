  
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
            
            // Afficher les enfants
            displayChildren(person.id, 'enfant', data);

            // Afficher les petits-enfants
            var children = data.filter(child => child.id_pere === person.id || child.id_mere === person.id);
            children.forEach(function(child) {
            displayChildren(child.id, 'grandenfant', data);
        });
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
      personHTML += '<p>Date de décès : ' + person.date_deces + '</p>';
    }
    personHTML += '</div>';
    container.innerHTML = personHTML;
    const personContainer = document.getElementById('person-container');
    personContainer.appendChild(container);
}

function displayGrandParent(father1Id, mother1Id, father2Id, mother2Id, containerClass, data) {
  var container1 = document.createElement('div');
  container1.className = containerClass;

  var father1 = data.find(person => person.id === father1Id);
  var mother1 = data.find(person => person.id === mother1Id);
  if (father1) {
      var pere1HTML = '<div class="' + containerClass + ' male">';
      pere1HTML += '<p>' + father1.nom + ' ' + father1.prenom + '</p>';
      pere1HTML += '</div>';
      container1.innerHTML += pere1HTML;
  }
  if (mother1) {
      var mere1HTML = '<div class="' + containerClass + ' female">';
      mere1HTML += '<p>' + mother1.nom + ' ' + mother1.prenom + '</p>';
      mere1HTML += '</div>';
      container1.innerHTML += mere1HTML;
  }

  var container2 = document.createElement('div');
  container2.className = containerClass;

  var father2 = data.find(person => person.id === father2Id);
  var mother2 = data.find(person => person.id === mother2Id);
  if (father2) {
      var pere2HTML = '<div class="' + containerClass + ' male">';
      pere2HTML += '<p>' + father2.nom + ' ' + father2.prenom + '</p>';
      pere2HTML += '</div>';
      container2.innerHTML += pere2HTML;
  }
  if (mother2) {
      var mere2HTML = '<div class="' + containerClass + ' female">';
      mere2HTML += '<p>' + mother2.nom + ' ' + mother2.prenom + '</p>';
      mere2HTML += '</div>';
      container2.innerHTML += mere2HTML;
  }

  const personContainer = document.getElementById('person-container');
  if (container1.innerHTML.trim() !== '') {
      personContainer.appendChild(container1);
  }
  if (container2.innerHTML.trim() !== '') {
      personContainer.appendChild(container2);
  }
}

function displayRelations(fatherId, motherId, containerClass, data) {
    var father = data.find(person => person.id === fatherId);
    var mother = data.find(person => person.id === motherId);
    if (father || mother) {
        var container = document.createElement('div');
        container.className = containerClass;
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

function displayChildren(parentId, containerClass, data) {
  var children = data.filter(child => child.id_pere === parentId || child.id_mere === parentId);
  if (children.length > 0) {
      var container = document.createElement('div');
      container.className = containerClass;
      children.forEach(function(child) {
      var genderClass = child.genre === 'M' ? 'male' : 'female';
      var childHTML = '<div class="' + containerClass + ' ' + genderClass + '">';
      childHTML += '<p>' + child.nom + ' ' + child.prenom + '</p>';
      childHTML += '</div>';
      container.innerHTML += childHTML;
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


  
// Appeler la fonction pour afficher les données
displayData();
  
