  
// Fonction pour charger les données JSON
function loadJSON(callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == 200) {
        callback(xobj.responseText);
        }
    };
    xobj.send(null);  
}

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
            var personContainer = document.getElementById('person-container');
            
            // Afficher les informations de la personne
            var genderClass = person.genre === 'M' ? 'male' : 'female';
            var personHTML = '<div class="personne ' + genderClass + '">';
            personHTML += '<h4>' + person.nom + ' ' + person.prenom + '</h4>';
            personHTML += '<p>Date de naissance : ' + person.date_naissance + '</p>';
            // Ajouter la date de décès si elle existe
            if (person.date_deces) {
              personHTML += '<p>Date de décès : ' + person.date_deces + '</p>';
            }
            personHTML += '</div>';
            personContainer.innerHTML = personHTML;
 
            // Afficher les parents
            displayRelations(person.id_pere, person.id_mere, 'parent', data);           
            
            // Trouver les parents de la personne
            var father = data.find(person => person.id === person.id_pere);
            var mother = data.find(person => person.id === person.id_mere);

            // Trouver les grands-parents paternels
            var grandPere_Pat = data.find(parent => parent.id === father.id_pere);
            var grandMere_Pat = data.find(parent => parent.id === father.id_mere);

            // Trouver les grands-parents maternels
            var grandPere_Mat = data.find(parent => parent.id === mother.id_pere);
            var grandMere_Mat = data.find(parent => parent.id === mother.id_mere);


            // Afficher les grands-parents
            if (person.id_pere && person.id_mere) {
                displayRelations(grandPere_Pat.id_pere, grandMere_Pat.id_mere, 'grandparentpaternel', data);
                displayRelations(grandPere_Mat.id_pere, grandMere_Mat.id_mere, 'grandparentmaternel', data);
            }
            if (person.id_pere && !person.id_mere) {
                displayRelations(grandPere_Pat.id_pere, grandMere_Pat.id_mere, 'grandparentpaternel', data);
            }
            if (!person.id_pere && person.id_mere) {
                displayRelations(grandPere_Mat.id_pere, grandMere_Mat.id_mere, 'grandparentmaternel', data);
            }                
            
            // Afficher les enfants
            displayChildren(person.id, 'enfant', data);
            
            // Afficher les petits-enfants
            var children = data.filter(child => child.id_pere === person.id || child.id_mere === person.id);
            children.forEach(function(child) {
            displayChildren(child.id, 'grandenfant', data);
        });
    });
}


function displayRelations(fatherId, motherId, containerClass, data) {
    var father = data.find(person => person.id === fatherId);
    var mother = data.find(person => person.id === motherId);
    if (father || mother) {
      var container = document.createElement('div');
      container.className = 'container ' + containerClass;
      var pereHTML = '<div class="' + containerClass + ' male">';
      var mereHTML = '<div class="' + containerClass + ' female">';
      if (father ) {
        pereHTML += '<p>' + father.nom + ' ' + father.prenom + '</p>';
        pereHTML += '</div>';
        container.innerHTML += pereHTML;
      }
      if (mother ) {
        mereHTML += '<p>' + mother.nom + ' ' + mother.prenom + '</p>';
        mereHTML += '</div>';
        container.innerHTML += mereHTML;
      }
      var personContainer = document.getElementById('person-container');
      personContainer.insertBefore(container, personContainer.firstChild);
    }
  }


// Fonction pour afficher les enfants
function displayChildren(parentId, containerClass, data) {
var children = data.filter(child => child.id_pere === parentId || child.id_mere === parentId);
if (children.length > 0) {
    var container = document.createElement('div');
    container.className = 'container ' + containerClass;
    children.forEach(function(child) {
    var genderClass = child.genre === 'M' ? 'male' : 'female';
    var childHTML = '<div class="' + containerClass + ' ' + genderClass + '">';
    childHTML += '<p>' + child.nom + ' ' + child.prenom + '</p>';
    childHTML += '</div>';
    container.innerHTML += childHTML;
    });
    var personContainer = document.getElementById('person-container');
    personContainer.appendChild(container);
}
}

   
// Appeler la fonction pour afficher les données
displayData();
  