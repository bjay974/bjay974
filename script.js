fetch('data.json').then(response=>response.json()).then(data=>{

  const sortedData = data.sort((a, b) => b.id - a.id);
  const famille = sortedData.filter(person => person.id <= 203);
  const branchePat= sortedData.filter(person => person.id >= 204 && person.id <= 999);
  const brancheMat= sortedData.filter(person => person.id >= 1000 && person.id <= 1999);
  
  // Filtrer les personnes par genre
  const filterByGender = (people, gender) => people.filter(person => person.genre === gender);
  const hommesPat= filterByGender(branchePaternelle, 'M');
  const femmesPat= filterByGender(branchePaternelle, 'F');
  const hommesMat= filterByGender(brancheMaternelle, 'M');
  const femmesMat= filterByGender(brancheMaternelle, 'F');
  const hommesFam = filterByGender(famille, 'M');
  const femmesFam = filterByGender(famille, 'F');
  
  const homPatList = document.getElementById('homme-list-paternelle');
  const femPatList = document.getElementById('femme-list-paternelle');
  const homMatList = document.getElementById('homme-list-maternelle');
  const femMatList = document.getElementById('femme-list-maternelle');
  const homFamList = document.getElementById('homme-list');
  const femFamList = document.getElementById('femme-list');
  
  // Affichage des hommes de la branche paternelle
  const titlehomPatList = document.createElement('p');
  titlehomPatList.textContent = 'Boug coté papa';
  titlehomPatList.classList.add('label');
  homPatList.appendChild(titlehomPatList);
  hommesPat.forEach(person=>{
    const listItem = createListItem(person);
    homPatList.appendChild(listItem);
  });
  // Affichage des femmes de la branche paternelle
  const titlefemPatList = document.createElement('p');
  titlefemPatList.textContent = 'Fanm coté papa';
  titlefemPatList.classList.add('label');
  femPatList.appendChild(titlefemPatList);
  femmesPat.forEach(person=>{
    const listItem = createListItem(person);
    femPatList.appendChild(listItem);
  });
  // Affichage des hommes de la branche maternelle
  const titlehomMatList = document.createElement('p');
  titlehomMatList.textContent = 'Boug coté momon';
  titlehomMatList.classList.add('label');
  homMatList.appendChild(titlehomMatList);
  hommesMat.forEach(person=>{
    const listItem = createListItem(person);
    homMatList.appendChild(listItem);
  });
  // Affichage des femmes de la branche maternelle
  const titlefemmatList = document.createElement('p');
  titleFemMatList.textContent = 'Fanm coté momon';
  titleFemMatList.classList.add('label');
  femMatList.appendChild(titleFemMatList);
  femmesMat.forEach(person=>{
    const listItem = createListItem(person);
    femMatList.appendChild(listItem);
  });
  // Affichage des hommes de la famille
  const titlehomfamList = document.createElement('p');
  titleHomFamList.textContent = 'Boug';
  titleHomFamList.classList.add('label');
  homFamList.appendChild(titleHomFamList);
  hommesFam.forEach(person=>{
    const listItem = createListItem(person);
    homFamList.appendChild(listItem);
  });
  // Affichage des femmes de la famille
  const titlefemfamList = document.createElement('p');
  titleFemfamList.textContent = 'Fanm';
  titleFemfamList.classList.add('label');
  femFamList.appendChild(titleFemfamList);
  femmesFam.forEach(person=>{
    const listItem = createListItem(person);
    femFamList.appendChild(listItem);
  });
}).catch(error=>console.error('Erreur lors du chargement des données :', error));

function createListItem(person) {
  const li = document.createElement('li');
  li.className = person.genre === 'M' ? 'hommelist' : 'femmelist';
  li.innerHTML = `
      <a href="${person.id < 2000 ? 'person.html?id=' + person.id : '#'}" class="${person.genre === 'M' ? 'lienM' : 'lienF'}">
          ${person.nom} ${person.prenom} (${createAnNaissance(person.date_naissance)}${person.date_deces ? ' / ' + createAnDeces(person.date_deces) : ''}) 
          <em>${getOrigine(person.lieu_naissance)} G${createGenerationId(person)}</em>
      </a>
  `;
  return li;
}

function createGenerationId(person) {
  const personId = person.id.toString();
  let idGeneration;
  if (person.id < 100) {
    idGeneration = 0
  } 
  else if (person.id < 1000) {
    idGeneration = parseInt(personId.charAt(0));
  } 
  else if (person.id >= 1000 && person.id < 2000) {
    // Prendre les deux premiers chiffres de l'ID
    idGeneration = parseInt(personId.substr(1, 1));
  }
  return "G" + idGeneration;
}

function createAnNaissance(date) {
  const year = parseInt(date.substr(6, 4)); // Extrait l'année à partir de la chaîne de date
  if (year === 1901) {
    return '??'; // Retourne un point d'interrogation pour indiquer une année inconnue
  }
  return year;
}

function createAnDeces(date) {
  const year = parseInt(date.substr(6, 4)); 
  if (year === 1901) {
    return '??'; // 
  }
  return year;
}

function getOrigine(lieuDeNaissance) {
  const lieuxAcceptes = ["Afrique", "Warrio - Nigéria", "Nigéria", "Madagascar", "Indes", "France"];
  return lieuxAcceptes.includes(lieuDeNaissance) ? `(${lieuDeNaissance})` : "";
}
