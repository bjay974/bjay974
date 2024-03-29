  
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
            if (person.id_pere && person.id_mere) {
                displayRelations(gr_mere_pat, gr_pere_pat, 'container13', 'grandparentpaternel', data);
                displayRelations(gr_mere_mat, gr_mere_mat, 'container13', 'grandparentmaternel', data);
            }
            if (person.id_pere && !person.id_mere) {
                displayRelations(gr_mere_pat, gr_pere_pat, 'container13', 'grandparentpaternel', data);
            }
            if (!person.id_pere && person.id_mere) {
                displayRelations(gr_mere_mat, gr_mere_mat, 'container13', 'grandparentmaternel', data);
            } 

            // Afficher les parents
            displayRelations(person.id_pere, person.id_mere, 'container12', 'parent', data);

            // Afficher les informations de la personne
            displayPersonne(person.id, 'container11', 'personne', data)
            
            // Afficher les enfants
            displayChildren(person.id, 'container14', 'enfant', data);

            // Afficher les petits-enfants
            var children = data.filter(child => child.id_pere === person.id || child.id_mere === person.id);
            children.forEach(function(child) {
            displayChildren(child.id, 'container15', 'grandenfant', data);
        });
    });
}

function displayPersonne(personneId, colonne, containerClass, data) {
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

function displayRelations(fatherId, motherId, colonne, containerClass, data) {
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

function displayChildren(parentId, colonne, containerClass, data) {
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
  
