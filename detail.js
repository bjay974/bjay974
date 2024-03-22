document.addEventListener('DOMContentLoaded', () => {

    // Extraire l'identifiant de la personne depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const personId = urlParams.get('id');

    // Charger les données depuis le fichier JSON
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // Trouver la personne correspondante
            const person = data.find(p => p.id === parseInt(personId));
            const personDetails = document.getElementById('person-details');
            if (person) {
                const detailsList = document.createElement('ul');

                // Ajouter le nom et prénom en gras
                const nameItem = document.createElement('h3');
                nameItem.style.color = "blue";
                let nomLegitime = "";
                if (person.nom_legitime) {
                   nomLegitime = person.nom_legitime
                }
                nameItem.innerHTML = `${person.nom} <em>${nomLegitime}</em> ${person.prenom}`;
                detailsList.appendChild(nameItem);
                
                // Ajouter la date de naissance
                const birthDateItem = document.createElement('li');
                const adjectif_genre = ajouterE("Né", person.genre);
                const dateVerified = verifieDate(person.date_naissance);
                birthDateItem.textContent = `${adjectif_genre} ${dateVerified} à ${person.lieu_naissance}`;
                detailsList.appendChild(birthDateItem);
                    // Ajouter la date de reconnaisance ainsi que le nom
                    if (person.date_legitime) {
                        const legDateItem = document.createElement('li');
                        legDateItem.classList.add('special-li');
                        const dateVerified = verifieDate(person.date_legitime);
                        const adjectif_genre = ajouterE("Reconnu", person.genre);
                        const nomEnBleu = `<span style="color:blue;">${person.nom_legitime}</span`
                        legDateItem.innerHTML = `<em>${adjectif_genre}<strong> ${nomEnBleu} </strong></em> ${dateVerified}`;
                        detailsList.appendChild(legDateItem);
                    }
                    if (!person.date_deces) {
                        const ageNowItem = document.createElement('li');
                        const ageNow = calculeAge(person.date_naissance);
                        ageNowItem.classList.add('special-li');
                        const adjectif_genre = ajouterE("Agé", person.genre)
                        ageNowItem.textContent = `${adjectif_genre} de : ${ageNow} ans `;
                        detailsList.appendChild(ageNowItem);
                    }    

                detailsList.appendChild(document.createElement('br')); // Ajout d'un espace

                // Ajouter la date de mariage et le nom si la date n'est pas nulle
                if (person.date_mariage !== null) {
                    const weddingDateItem = document.createElement('li');
                    const ageMariage = diffAge(person.date_mariage, person.date_naissance);
                    const adjectif_genre = ajouterE("Marié", person.genre)
                    weddingDateItem.textContent = `${adjectif_genre} le ${person.date_mariage} à l'âge de ${ageMariage} ans à ${person.lieu_mariage}`;
                    detailsList.appendChild(weddingDateItem);  
                    const conjoint = data.find(p => p.id === person.id_conjoint);
                        if (conjoint) {
                            const conjointItem = document.createElement('li');
                            conjointItem.classList.add('special-li');
                            conjointItem.innerHTML = `à : <strong>${conjoint.nom} ${conjoint.prenom}</strong>`;
                            detailsList.appendChild(conjointItem);    
                            detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                        }
                }
                
                 // Ajouter la date de décès si elle n'est pas nulle
                if (person.date_deces !== null) {
                    const ageDeces = diffAge(person.date_deces, person.date_naissance);
                    if (ageDeces > 0) {
                        const deathDateItem = document.createElement('li');
                        const dateVerified = verifieDate(person.date_deces) 
                        const adjectif_genre = ajouterE("Décédé", person.genre)
                        deathDateItem.textContent = `${adjectif_genre} ${dateVerified} à l'âge de ${ageDeces} ans à ${person.lieu_deces}`;
                        detailsList.appendChild(deathDateItem);
                        detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                    }
                }

                // Charger le ou la conjoint
                if (person.date_mariage === null) {
                    if (person.id_conjoint) {
                        const conjoint = data.find(p => p.id === person.id_conjoint);
                        if (conjoint) {
                            const conjointItem = document.createElement('li');
                            const adjectif_genre = ajouterEgenreM("Conjoint", person.genre);
                            conjointItem.innerHTML = `<strong>${adjectif_genre} ${conjoint.nom} ${conjoint.prenom}</strong>` ;
                            detailsList.appendChild(conjointItem);
                            detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                    }    } 
                }
                
                // Charger le père si l'ID du père est défini
                if (person.id_pere) {
                    const father = data.find(p => p.id === person.id_pere);
                    if (father) {
                        const fatherItem = document.createElement('li');
                        const adjectif_genre = ajouterParent(person.genre);
                        fatherItem.innerHTML = `<em>${adjectif_genre} de </em><strong>${father.nom} ${father.prenom}</strong>`;
                        detailsList.appendChild(fatherItem);
                    } 
                 else {
                    const fatherItem = document.createElement('li');
                    fatherItem.innerHTML = `<em>Père </em> inconnu`;
                    detailsList.appendChild(fatherItem);
                    }
                }
                
              // Charger la mère si l'ID de la mère est défini
                if (person.id_mere) {
                    const mother = data.find(p => p.id === person.id_mere);
                    if (mother) {
                        const motherItem = document.createElement('li');
                        motherItem.classList.add('special-li');
                        const adjectif_genre = ajouterParent(person.genre);
                        motherItem.innerHTML = `<em>et de \t\t</em><strong> ${mother.nom} ${mother.prenom}</strong>`;
                        detailsList.appendChild(motherItem);
                        detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                     }
                 else {
                    const motherItem = document.createElement('li');
                    motherItem.innerHTML = `<em>Mère</em> inconnue`;
                    detailsList.appendChild(motherItem);
                    detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                    }   
                }
                
                // Récupérer les enfants de la personne si elle est définie comme père ou mère
                const childrenOfPerson = data.filter(child => child.id_pere === person.id || child.id_mere === person.id);
                if (childrenOfPerson.length > 0) {
                    childrenOfPerson.sort((a, b) => b.id - a.id);
                    const childrenOfPersonList = document.createElement('li');
                    childrenOfPersonList.innerHTML = "<strong>Enfant(s)</strong> :";
                    const childrenOfPersonUl = document.createElement('ul');
                    childrenOfPerson.forEach(child => {
                        const childItem = document.createElement('li');
                        childItem.textContent = `${child.nom} ${child.prenom}`;
                        childrenOfPersonUl.appendChild(childItem);
                    });
                    childrenOfPersonList.appendChild(childrenOfPersonUl);
                    detailsList.appendChild(childrenOfPersonList);
                    detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                } 
             
              // Charger les liens vers les actes si il y en a
              if (person.acte_nai === true || person.acte_dec === true || person.acte_mar === true || person.affranchi === true  ) {
                    const nomFichier = person.id;
                    const repertoires = ['naissance', 'mariage', 'particulier', 'deces'];
                    for (let i = 0; i < repertoires.length; i++) {    
                      const repertoire = repertoires[i];
                      const extensions = ['pdf', 'jpg', 'jpeg'];
                      for (let i = 0; i < extensions.length; i++) {
                          const extension = extensions[i];
                          const monFichier = `${repertoire}/${nomFichier}.${extension}`;
                          fetch(`${monFichier}`)
                          .then(response => {
                              if (response.ok) {
                                  const acteItem = document.createElement('li');
                                  const ficLink = document.createElement('a');
                                  if (repertoire === "particulier"){
                                       ficLink.textContent = `Voir l'acte spécial`;}
                                  else if (repertoire === "deces"){
                                       ficLink.textContent = `Voir l'acte de décés `; }  
                                  else {
                                       ficLink.textContent = `Voir l'acte de ${repertoire}`; }   
                                  ficLink.href = monFichier;
                                  ficLink.target = '_blank';                                  
                                  ficLink.style.textDecoration = "none";
                                  ficLink.style.color = "blue"; 
                                  acteItem.appendChild(ficLink);
                                  const monFichierBis = `${repertoire}/${nomFichier}_2.${extension}`
                                  fetch(`${monFichierBis}`)
                                  .then(response => {
                                      if (response.ok) {
                                          const ficLinkbis = document.createElement('a');
                                          ficLinkbis.textContent = `Voir la Partie 2`;
                                          ficLinkbis.href = monFichierBis;                                          
                                          ficLinkbis.style.textDecoration = "none";
                                          ficLinkbis.style.color = "blue";
                                          acteItem.appendChild(document.createTextNode('  ||  '));
                                          acteItem.appendChild(ficLinkbis);
                                  } })
                                  detailsList.appendChild(acteItem);
                             } })
                      }
                    }     
              }
 
                personDetails.appendChild(detailsList);
            }      
        })
     
        .catch(error => console.error('Erreur lors du chargement des données JSON:', error));

});

function diffAge(date1, date2) {   
    const an1 = parseInt(date1.substr(6, 4));
    const mois1 = parseInt(date1.substr(3, 2));
    const day1 = parseInt(date1.substr(0, 2));
    const an2 = parseInt(date2.substr(6, 4));
    const mois2 = parseInt(date2.substr(3, 2));
    const day2 = parseInt(date2.substr(0, 2));
    const dateNaissance = new Date(an2, mois2 - 1, day2); // Le mois commence à 0 dans les objets Date
    const newDate1 = new Date(an1, mois1 - 1, day1); // Le mois commence à 0 dans les objets Date
    const ageDiff = newDate1 - dateNaissance.getTime(); // Différence en millisecondes
    const ageDate = new Date(ageDiff); // Conversion de la différence en objet Date
    return Math.abs(ageDate.getUTCFullYear() - 1970); // Obtenez l'année de l'objet Date pour obtenir l'âge
}

function calculeAge(date1) {   
    const an = parseInt(date1.substr(6, 4));
    const mois = parseInt(date1.substr(3, 2));
    const day = parseInt(date1.substr(0, 2));
    const dateNaissance = new Date(an, mois - 1, day); // Le mois commence à 0 dans les objets Dat
    const today = new Date();
    const ageDiff = today.getTime() - dateNaissance.getTime(); // Différence en millisecondes
    const ageDate = new Date(ageDiff); // Conversion de la différence en objet Date
    return Math.abs(ageDate.getUTCFullYear() - 1970); // Obtenez l'année de l'objet Date pour obtenir l'âge
}

//Ajouter un e a un adjectif !! si genre est F (ex : NéE)
function ajouterE(adjectif, genre) {
    if (genre === "F") {
        return adjectif + "e";
    } else {
        return adjectif;
    }
}

//Ajouter un e a un adjectif !! si genre est M (ex : conjointE)
function ajouterEgenreM(adjectif, genre) {
    if (genre === "M") {
        return adjectif + "e";
    } else {
        return adjectif;
    }
}

//Ajouter Fils de ou Fille de en fonction du genre
function ajouterParent(genre) {
    if (genre === "M") {
        return "Fils" ;
    } else {
        return "Fille";
    }
}

//Verifie si la date est connue  
function verifieDate(date) {
    const an = parseInt(date.substr(6, 4));
    const mois = parseInt(date.substr(3, 2));
    const day = parseInt(date.substr(0, 2));
    if (day === 1 && mois === 1) {
        if (an === 1901) {
            return "à une date inconnue" 
        }  else {
            return "dans le courant de l'année " + an
        }
    } else {
        return "le " + date
    }
}
