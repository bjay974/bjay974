  
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

    console.log(personId);

    loadJSON(function(response) {
        var data = JSON.parse(response);
        var person = data.find(person => person.id === personId);
        var personContainer = document.getElementById('person-container');
        
        // Afficher les informations de la personne
        var genderClass = person.id_genre === 'M' ? 'male' : 'female';
        var personHTML = '<div class="container ' + genderClass + '">';
        personHTML += '<h4>' + person.nom + ' ' + person.prenom + '</h4>';
        personHTML += '<p>Date de naissance : ' + person.date_naissance + '</p>';
        personHTML += '</div>';
        personContainer.innerHTML = personHTML;
        
        // Afficher les parents
        displayRelations(person.id_pere, person.id_mere, 'parent', 'Parents', data);
        
        // Afficher les grands-parents
        var father = data.find(person => person.id === person.id_pere);
        var mother = data.find(person => person.id === person.id_mere);
        if (father && mother) {
        displayRelations(father.id_pere, father.id_mere, 'grandparent', 'Grands-parents', data);
        displayRelations(mother.id_pere, mother.id_mere, 'grandparent', 'Grands-parents', data);
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
function displayRelations(fatherId, motherId, containerClass, title, data) {
var father = data.find(person => person.id === fatherId);
var mother = data.find(person => person.id === motherId);
if (father && mother) {
    var container = document.createElement('div');
    container.className = 'container ' + containerClass;
    var titleElement = document.createElement('h3');
    titleElement.textContent = title;
    container.appendChild(titleElement);
    var parentHTML = '<div>';
    parentHTML += '<p>Père : ' + father.nom + ' ' + father.prenom + '</p>';
    parentHTML += '<p>Mère : ' + mother.nom + ' ' + mother.prenom + '</p>';
    parentHTML += '</div>';
    container.innerHTML += parentHTML;
    var personContainer = document.getElementById('person-container');
    personContainer.insertBefore(container, personContainer.firstChild);
}
}

// Fonction pour afficher les enfants
function displayChildren(parentId, containerClass, title, data) {
var children = data.filter(child => child.id_pere === parentId || child.id_mere === parentId);
if (children.length > 0) {
    var container = document.createElement('div');
    container.className = 'container ' + containerClass;
    var titleElement = document.createElement('h3');
    titleElement.textContent = title;
    container.appendChild(titleElement);
    children.forEach(function(child) {
    var genderClass = child.id_genre === 'M' ? 'male' : 'female';
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
  