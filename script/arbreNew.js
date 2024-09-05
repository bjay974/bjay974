// Fonction pour afficher les données dans la page
function displayData() {

   let personId = 302;
    
    // Charger les données depuis le fichier JSON
    fetch('../data/data.json')
        .then(response => response.json())
        .then(data => {
            // Trouver la personne correspondante
            const personData = data.find(p => p.id === (personId));
            const generations = obtenirGenerations(personId, data); console.log(generations);
            // Afficher les informations de la personne
            afficherPersonne(personData, 'personConteneur');
            // Afficher les ancetres
            afficherGenerations(generations, data)           
        });
  }

function afficherPersonne(persData, generationClasse) {
  // Générer les informations nécessaires
  const afficheDate = creerDate(persData.date_naissance, persData.date_deces);
  const origine = getOrigine(persData.lieu_naissance);
  const classeGenre = persData.genre === 'M' ? 'male' : 'female';

  const conteneur = document.createElement('div');
  conteneur.classList.add(classeGenre);

  const lien = document.createElement('a');
  lien.href = `../html/arbrePerso.html?id=${persData.id}`;
  lien.innerHTML = `${persData.nom} ${persData.prenom} <br> ${afficheDate} ${origine}`;
  conteneur.appendChild(lien);

  document.getElementById('page-conteneur').appendChild(conteneur);
}

// Fonction pour une case homme ou femme sans données
function afficherCaseVide(generationClasse, classeGenre) {
  const conteneur = document.createElement('div');
  conteneur.classList.add(generationClasse, classeGenre);
  conteneur.textContent = ''; 
  document.getElementById('page-conteneur').appendChild(conteneur);
}


// Fonction qui affiche chaque personne dans le conteneur correspondant
function afficherGenerations(generations, data) {
  // Boucle sur chaque génération
  generations.forEach((generation, index) => {
      // Sélectionner le conteneur pour la génération correspondante (generation1, generation2, etc.)
      const generationClass = `generation${index + 1}`;
      const conteneurGeneration  = document.createElement('div');
      conteneurGeneration.classList.add(generationClass); 
      // Boucle sur chaque personne de la génération (pair = père, impair = mère)
        generation.forEach(idPersonne => {
          if ((idPersonne === 10) || (idPersonne === 20)) {
            afficherCaseVide(
              generationClass, 
              (idPersonne === 10) ? 'male' : (idPersonne === 20) ? 'female' : ''
            );   }
          else {
            const personData = data.find(p => p.id === idPersonne);
            afficherPersonne(personData, generationClass); }
      });
  });
}

function creerDate(dateNaissance, dateDeces) {
  const anNaiss = parseInt(dateNaissance.substr(6, 4)); 
  const anDeces = parseInt(dateDeces.substr(6, 4)); 
  let texteNaissance
  let texteDeces
  if (anNaiss === 1901) {      
     texteNaissance = "??"}
  else 
     texteNaissance = "" ;
  if (anDeces === 1901) {
      texteDeces = "??" 
      return `${texteNaissance} ${anNaiss} / ${texteDeces}` }
  else {
      return `${texteNaissance} ${anNaiss} / ${anDeces}`
    };

}

function getOrigine(lieuDeNaissance) {
  // Vérification des valeurs nulles, indéfinies ou de type incorrect
  if (!lieuDeNaissance || typeof lieuDeNaissance !== 'string') {
    return ""; 
  }
  const lieuxAcceptes = ["Afrique", "Warrio - Nigéria", "Nigéria", "Madagascar", "Indes", "France"];
  return lieuxAcceptes.includes(lieuDeNaissance) ? `(${lieuDeNaissance})` : "";
}
   
// Fonction pour retrouver une personne par son ID dans le tableau
function trouverPersonneParId(id, data) {
  return data.find(person => person.id === id);
}

// Fonction pour récupérer les ancêtres sur plusieurs générations
function obtenirGenerations(idPersonne, data) {
  let resultats = [];
  let personnesCourantes = [idPersonne]; // Démarrer avec l'ID de la personne initiale
  for (let i = 1; i <= 5; i++) {
      let generationActuelle = [];
      let prochaineGeneration = [];
      personnesCourantes.forEach(id => {
          let personne = trouverPersonneParId(id, data);
          if (personne) {
              // Ajouter le père à la génération actuelle, sinon ajouter 10 par défaut
              let idPere = personne.id_pere !== null && personne.id_pere !== undefined && personne.id_pere !== "inconnu" ? personne.id_pere : 10;
              generationActuelle.push(idPere);
              prochaineGeneration.push(idPere);

              // Ajouter la mère à la génération actuelle, sinon ajouter 20 par défaut
              let idMere = personne.id_mere !== null && personne.id_mere !== undefined && personne.id_mere !== "inconnue" ? personne.id_mere : 20;
              generationActuelle.push(idMere);
              prochaineGeneration.push(idMere);
          } else {
              // Si la personne n'existe pas, ajouter les parents par défaut
              generationActuelle.push(10); // Père par défaut
              generationActuelle.push(20); // Mère par défaut
              prochaineGeneration.push(10); // Père par défaut
              prochaineGeneration.push(20); // Mère par défaut
          }
      });
      resultats.push(generationActuelle);
      personnesCourantes = prochaineGeneration; // Passer à la génération suivante
  }
  return resultats;
}

  
  // Appeler la fonction pour afficher les données
  displayData();
  
  