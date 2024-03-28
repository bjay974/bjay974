  
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
            var father = data.find(person => person.id === person.id_pere);
            var mother = data.find(person => person.id === person.id_mere);
            if (father) {
                displayRelations(father.id_pere, 'parent', father.genre, data);
            }
            if (mother) {
                displayRelations(mother.id_mere, 'parent', mother.genre, data);
            }            
            
           // Afficher les grands-parents
            var grandfather = data.find(person => person.id === person.id_pere);
            var grandmother = data.find(person => person.id === person.id_mere);
            if (grandfather) {
                displayRelations(grandfather.id_pere, 'grandparent', grandfather.genre, data);
            }
            if (grandmother) {
                displayRelations(grandmother.id_mere, 'grandparent', grandmother.genre, data);
            }
            
            // Afficher les enfants
            displayChildren(person.id, 'child', 'Enfants', data);
            
            // Afficher les petits-enfants
            var children = data.filter(child => child.id_pere === person.id || child.id_mere === person.id);
            children.forEach(function(child) {
            displayChildren(child.id, 'grandchild', 'Petits-enfants', data);
        });
    });
}


// Fonction pour afficher les relations (parents, grands-parents)
function displayRelations(parentId, containerClass, genderClass, data) {
    var container = document.createElement('div');
    container.className = 'container ' + containerClass;
    var parentHTML = '<div class="container ' + genderClass + '">';
    var parentHTML = '<div>';
    parentHTML += '<p>' + father.nom + ' ' + father.prenom + '</p>';
    parentHTML += '</div>';
    container.innerHTML += parentHTML;
    var personContainer = document.getElementById('person-container');
    personContainer.insertBefore(container, personContainer.firstChild);
}


// Fonction pour afficher les enfants
function displayChildren(parentId, containerClass, data) {
var children = data.filter(child => child.id_pere === parentId || child.id_mere === parentId);
if (children.length > 0) {
    var container = document.createElement('div');
    container.className = 'container ' + containerClass;
    children.forEach(function(child) {
    var genderClass = child.genre === 'M' ? 'male' : 'female';
    var childHTML = '<div class="container ' + genderClass + '">';
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
  