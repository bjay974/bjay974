  
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
    var naissance = '\u{1F476}'
    var personHTML = '<div class="' + containerClass + ' ' + genderClass + '">';
    container.className = containerClass;
    personHTML += '<h4>' + person.nom + ' ' + person.prenom + '</h4>';
    if (person.date_naissance !=== "01/01/1901") {
      var dateNaissance = verifieDate(person.date_naissance);
      personHTML += '<p>' + naissance + '  ' + dateNaissance + '</p>';
    }

    if (person.date_deces) {
      var dateDeces = verifieDate(person.date_deces);
      if (person.date_deces === "01/01/1901") {
        personHTML += '<p>Date de décès inconnue</p>'; }
      else {   
      personHTML += '<p>Décès : ' + dateDeces + '</p>'; }
    }
    personHTML += '</div>';
    container.innerHTML += personHTML;
   
    if (person.id_conjoint > 0){
      var conjoint = data.find(p => p.id === person.id_conjoint);
      var genderconjointClass = conjoint.genre === 'M' ? 'male' : 'female';
      var conjointHTML = '<div class="' + containerClass + ' ' + genderconjointClass + '">';
      var title = document.createElement('p');
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
      title.style.fontStyle = 'italic';
      title.classList.add('label'); 
      container.appendChild(title); 


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
    var title = document.createElement('p');
    var titrePat = titre + " Paternels";
    var titrePatSansS = titrePat.replace(/s/g, '');
    if (father1 && mother1) {
      title.textContent = titrePat;
    } else {
      title.textContent = titrePatSansS;
    }
    title.style.fontStyle = 'italic';
    title.classList.add('label'); 
    container.appendChild(title);
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
    var title = document.createElement('p');
    if (father2 && mother2) {
      title.textContent = titreMat;
    } else {
      title.textContent = titreMatSansS;
    }
    title.style.fontStyle = 'italic';
    title.classList.add('label'); 
    container.appendChild(title);
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
          childHTML += '<p><a href="arbrePerso.html?id=' + child.id  + '" style="text-decoration: none; color: inherit;">' + child.nom + ' ' + child.prenom + '</a></p>';
          childHTML += '</div>';
          container.innerHTML += childHTML;
      });
      const personContainer = document.getElementById('person-container');
      personContainer.appendChild(container);
  }

  if (grandChildren.length > 0) {
      // Ajouter un titre
      var container = document.createElement('div');
      var title = document.createElement('p');
      var containerClass2 = 'grandenfant';
      container.className = containerClass2;
      if (grandChildren.length === 1) {
        title.textContent = "Petit Enfant";
      } else {
        title.textContent = "Petits Enfants";
      }
      title.style.fontStyle = 'italic';
      title.classList.add('label'); 
      container.appendChild(title);
      // Afficher les petits-enfants
      grandChildren.sort((a, b) => b.id - a.id);
      grandChildren.forEach(function(grandChild) {
          var genderClass = grandChild.genre === 'M' ? 'male' : 'female';
          var grandChildHTML = '<div class="' + containerClass2 + ' ' + genderClass + '">';
          grandChildHTML += '<p><a href="arbrePerso.html?id=' + grandChild.id  + '" style="text-decoration: none; color: inherit;">' + grandChild.nom + ' ' + grandChild.prenom + '</a></p>';
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

  
// Appeler la fonction pour afficher les données
displayData();
  
