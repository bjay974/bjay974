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
                nameItem.classList.add('soustitre');
                if (person.genre === "M") {
                    nameItem.style.color = "rgb(11, 65, 83)";
                }
                else{
                    nameItem.style.color = "#583a3a";        
                }                
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
                if (person.lieu_naissance === "Inconnu"){
                    birthDateItem.textContent = `${adjectif_genre} ${dateVerified}`;
                }
                else {
                    if (person.lieu_naissance === "Afrique") {
                       birthDateItem.textContent = `${adjectif_genre} ${dateVerified} en Afrique`; 
                    }
                    else {
                       birthDateItem.textContent = `${adjectif_genre} ${dateVerified} à ${person.lieu_naissance}`;
                    }
                }
                detailsList.appendChild(birthDateItem);
                    // Ajouter la date de reconnaisance ainsi que le nom
                    if (person.date_legitime) {
                        const legDateItem = document.createElement('li');
                        legDateItem.classList.add('special-li');
                        const dateVerified = verifieDate(person.date_legitime);
                        const adjectif_genre = ajouterE("Reconnu", person.genre);
                        if (person.genre === "M"){
                            const nomEnCouleur = `<span style="color:rgb(11, 65, 83);"><strong>${person.nom_legitime}</strong></span>`;
                            legDateItem.innerHTML = `${adjectif_genre} <em>${nomEnCouleur}</em> ${dateVerified}`;
                        }
                        else {
                            const nomEnCouleur = `<span style="color:#583a3a;"><strong>${person.nom_legitime}</strong></span>`;
                            legDateItem.innerHTML = `${adjectif_genre} <em>${nomEnCouleur}</em> ${dateVerified}`;
                        }
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
                            const nomLink = document.createElement('a');
                            if (conjoint.id < 2000) {
                                nomLink.href = 'person.html?id=' + conjoint.id;
                            }
                            nomLink.style.textDecoration = "none";
                            conjointItem.appendChild(document.createTextNode(' à '));                            
                            if (conjoint.genre === "M"){
                                const nomEnCouleur = `<span style="color:rgb(11, 65, 83);"><strong>${conjoint.nom}</strong> ${conjoint.prenom}</span>`;
                                nomLink.innerHTML = `${nomEnCouleur}`;
                            }
                            else {
                                const nomEnCouleur = `<span style="color:#583a3a;"><strong>${conjoint.nom}</strong> ${conjoint.prenom}</span>`;
                                nomLink.innerHTML = `${nomEnCouleur}`;
                            }
                            conjointItem.appendChild(nomLink);
                            detailsList.appendChild(conjointItem);    
                            detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                        }
                }
                
                 // Ajouter la date de décès si elle n'est pas nulle
                if (person.date_deces !== null) {
                    const ageDeces = diffAge(person.date_deces, person.date_naissance);
                    if (person.date_deces !== "01/01/1901") {
                        if (ageDeces > 0) {
                             // Ajouter l'age du décés si la date de naissance existe 
                            if (person.date_naissance !== "01/01/1901") {
                                const deathDateItem = document.createElement('li');
                                const dateVerified = verifieDate(person.date_deces) 
                                const adjectif_genre = ajouterE("Décédé", person.genre)
                                if (person.lieu_deces === "Inconnu"){
                                    deathDateItem.textContent = `${adjectif_genre} ${dateVerified} à l'âge de ${ageDeces} ans`;
                                }
                                else {
                                    deathDateItem.textContent = `${adjectif_genre} ${dateVerified} à l'âge de ${ageDeces} ans à ${person.lieu_deces}`;
                                }
                                detailsList.appendChild(deathDateItem);
                                detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                            }
                            else
                            {
                                const deathDateItem = document.createElement('li');
                                const dateVerified = verifieDate(person.date_deces) 
                                const adjectif_genre = ajouterE("Décédé", person.genre)
                                if (person.lieu_deces === "Inconnu"){
                                    deathDateItem.textContent = `${adjectif_genre} ${dateVerified}`;
                                }
                                else {
                                    deathDateItem.textContent = `${adjectif_genre} ${dateVerified} à ${person.lieu_deces}`;
                                }
                                deathDateItem.textContent = `${adjectif_genre} ${dateVerified} à ${person.lieu_deces}`;
                                detailsList.appendChild(deathDateItem);
                                detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                            }
                        }
                        else {
                            const deathDateItem = document.createElement('li');
                            deathDateItem.textContent = `Date de décés inconnue`;
                            detailsList.appendChild(deathDateItem);
                            detailsList.appendChild(document.createElement('br')); // Ajout d'un espace 
                        }
                    } 
                }
                else { 
                      const deathDateItem = document.createElement('li');  
                      deathDateItem.textContent = `Date de décés inconnue`; 
                }

                // Charger la date d'affranchissement 
                if (person.affranchi === true) {
                    const ageAffranch = diffAge(person.date_affranchi, person.date_naissance);   
                    // Ajouter l'age de l'affranchissement  si la date de naissance existe 
                    if (person.date_naissance !== "01/01/1901") {
                        const affranchiDateItem = document.createElement('li');
                        const dateVerified = verifieDate(person.date_affranchi) 
                        const adjectif_genre = ajouterE("Affranchi", person.genre)
                        affranchiDateItem.textContent = `${adjectif_genre} ${dateVerified} à l'âge de ${ageAffranch} ans`;
                        detailsList.appendChild(affranchiDateItem);
                        detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                    }
                    else
                    {
                        const affranchiDateItem = document.createElement('li');
                        const dateVerified = verifieDate(person.date_affranchi) 
                        const adjectif_genre = ajouterE("Affranchi", person.genre)
                        affranchiDateItem.textContent = `${adjectif_genre} ${dateVerified}`;
                        detailsList.appendChild(affranchiDateItem);
                        detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                    } 

                }
                // Charger le ou la conjoint
                if (person.date_mariage === null) {
                    if (person.id_conjoint) {
                        const conjoint = data.find(p => p.id === person.id_conjoint);
                        if (conjoint) {
                            const conjointItem = document.createElement('li');
                            const nomLink = document.createElement('a');
                            if (conjoint.id < 2000) {
                                nomLink.href = 'person.html?id=' + conjoint.id;
                            }
                            nomLink.style.textDecoration = "none";
                            if (conjoint.genre === "M"){
                                conjointItem.appendChild(document.createTextNode(' Conjoint :  '));   
                                const nomEnCouleur = `<span style="color:rgb(11, 65, 83);"><strong>${conjoint.nom}</strong> ${conjoint.prenom} </span`;
                                nomLink.innerHTML = `${nomEnCouleur}` ;
                            }
                            else {
                                conjointItem.appendChild(document.createTextNode(' Conjointe :  '));
                                const nomEnCouleur = `<span style="color:#583a3a;"><strong>${conjoint.nom}</strong> ${conjoint.prenom} </span`;
                                nomLink.innerHTML = `${nomEnCouleur}` ;
                            }
                            conjointItem.appendChild(nomLink);
                            detailsList.appendChild(conjointItem);
                            detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                    }    } 
                }
                
                // Charger le père si l'ID du père est défini
                if (person.id_pere) {
                    var father = data.find(p => p.id === person.id_pere);
                    if (father) {
                        const fatherItem = document.createElement('li');
                        const nomLink = document.createElement('a');
                        nomLink.style.textDecoration = "none";
                        if (person.genre === "M") {
                            fatherItem.appendChild(document.createTextNode('Fils de ')); 
                        }
                        else  {
                            fatherItem.appendChild(document.createTextNode('Fille de ')); 
                        }  
                        if (father.id < 2000) {
                            nomLink.href = 'person.html?id=' + father.id;
                        }
                        const nomEnCouleur = `<span style="color:rgb(11, 65, 83);"><strong>${father.nom}</strong> ${father.prenom} </span>`;
                        nomLink.innerHTML = `${nomEnCouleur}`;
                        fatherItem.appendChild(nomLink);
                        detailsList.appendChild(fatherItem);
                    } 
                }
                else {
                    const fatherItem = document.createElement('li');
                    fatherItem.innerHTML = `<em>Père </em> inconnu`;
                    detailsList.appendChild(fatherItem);
                }
                
              // Charger la mère si l'ID de la mère est défini
                if (person.id_mere) {
                    const mother = data.find(p => p.id === person.id_mere);
                    if (mother) {
                        const motherItem = document.createElement('li');
                        const nomLink = document.createElement('a');
                        if (mother.id < 2000) {
                            nomLink.href = 'person.html?id=' + mother.id;
                        }
                        nomLink.style.textDecoration = "none";
                        if (father) {
                            motherItem.classList.add('special-li');
                            motherItem.appendChild(document.createTextNode(' et de ')); 
                        }
                        else {
                            if (person.genre === "M") {
                            motherItem.appendChild(document.createTextNode('Fils de ')); 
                            }
                            else  {
                            motherItem.appendChild(document.createTextNode('Fille de ')); 
                            }                            
                        }
                        const nomEnCouleur = `<span style="color:#583a3a;"><strong>${mother.nom}</strong> ${mother.prenom} </span>`;                        
                        nomLink.innerHTML = `${nomEnCouleur}`;
                        motherItem.appendChild(nomLink);
                        detailsList.appendChild(motherItem);
                        detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                     }
                }
                else {
                    const motherItem = document.createElement('li');
                    motherItem.innerHTML = `<em>Mère</em> inconnue`;
                    detailsList.appendChild(motherItem);
                    detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                }
                
                // Récupérer les enfants de la personne si elle est définie comme père ou mère
                const childrenOfPerson = data.filter(child => child.id_pere === person.id || child.id_mere === person.id);
                if (childrenOfPerson.length > 0) {
                    childrenOfPerson.sort((a, b) => b.id - a.id);
                    const childrenOfPersonList = document.createElement('li');
                    if (childrenOfPerson.length === 1) {
                        childrenOfPersonList.innerHTML = "<strong>Enfant</strong> :";
                    }
                    else {
                        childrenOfPersonList.innerHTML = "<strong>Enfants</strong> :";    
                    }
                    const childrenOfPersonUl = document.createElement('ul');
                    childrenOfPerson.forEach(child => {
                        const childItem = document.createElement('li');
                        const nomLink = document.createElement('a');
                        if (child.id < 2000) {
                            nomLink.href = 'person.html?id=' + child.id;
                        }
                        nomLink.style.textDecoration = "none";
                        if (child.genre==="M"){
                            nomLink.style.color = "rgb(11, 65, 83)";
                        }
                        else {
                            nomLink.style.color = "#583a3a";
                        }
                        nomLink.textContent = `${child.nom} ${child.prenom}`;
                        childItem.appendChild(nomLink);
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
                                  const acteItem = document.createElement('a');
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
                                  ficLink.style.color = "#999"; 
                                  ficLink.style.fontSize = "90%";
                                  acteItem.appendChild(ficLink);
                                  const monFichierBis = `${repertoire}/${nomFichier}_2.${extension}`
                                  fetch(`${monFichierBis}`)
                                  .then(response => {
                                      if (response.ok) {
                                          const ficLinkbis = document.createElement('a');
                                          ficLinkbis.textContent = `Voir la Partie 2`;
                                          ficLinkbis.href = monFichierBis;                                          
                                          ficLinkbis.style.textDecoration = "none";
                                          ficLinkbis.style.color = "#999";
                                          ficLinkbis.style.fontSize = "90%";
                                          acteItem.appendChild(document.createTextNode('  ||  '));
                                          acteItem.appendChild(ficLinkbis);
                                  } })
                                  detailsList.appendChild(acteItem);
                                  detailsList.appendChild(document.createElement('br'));
                             } })
                      }
                    }     
                 }
                else {
                    detailsList.appendChild(document.createElement('br')); 
                }

              // Charger les liens vers l'acte de mariage au nom du mari 
              if (person.acte_mar === true && person.genre === "F") {
                const nomFichier = person.id_conjoint;
                  const repertoire = "mariage";
                  const extensions = ['pdf', 'jpg', 'jpeg'];
                  for (let i = 0; i < extensions.length; i++) {
                      const extension = extensions[i];
                      const monFichier = `${repertoire}/${nomFichier}.${extension}`;
                      fetch(`${monFichier}`)
                      .then(response => {
                          if (response.ok) {
                              const acteItem = document.createElement('a');
                              const ficLink = document.createElement('a');
                              ficLink.textContent = `Voir l'acte de ${repertoire}`;   
                              ficLink.href = monFichier;
                              ficLink.target = '_blank';                                  
                              ficLink.style.textDecoration = "none";
                              ficLink.style.color = "#999"; 
                              ficLink.style.fontSize = "90%";
                              acteItem.appendChild(ficLink);
                              const monFichierBis = `${repertoire}/${nomFichier}_2.${extension}`
                              fetch(`${monFichierBis}`)
                              .then(response => {
                                  if (response.ok) {
                                      const ficLinkbis = document.createElement('a');
                                      ficLinkbis.textContent = `Voir la partie 2`;
                                      ficLinkbis.href = monFichierBis;                                          
                                      ficLinkbis.style.textDecoration = "none";
                                      ficLinkbis.style.color = "#999";
                                      ficLinkbis.style.fontSize = "90%";
                                      acteItem.appendChild(document.createTextNode('  ||  '));
                                      acteItem.appendChild(ficLinkbis);
                              } })
                              detailsList.appendChild(acteItem);
                              detailsList.appendChild(document.createElement('br'));
                         } })
                  }
             }
            else {
                detailsList.appendChild(document.createElement('br')); 
            }

            // Ajouter le lien vers l'arbre perso
            const arbrePersoItem = document.createElement('a');
            const arbrePersoLink = document.createElement('a');
            const prenomVoyelle = ['A', 'E', 'I', 'O', 'U', 'Y'].includes(person.prenom.charAt(0));

            if (person.prenom) {
                if (prenomVoyelle) {
                    arbrePersoLink.textContent = `Voir l'arbre d'${person.prenom}`;
                }
                else {
                    arbrePersoLink.textContent = `Voir l'arbre de ${person.prenom}`; 
                }
            }
            else {
                arbrePersoLink.textContent = `Voir son arbre`;
            }
            if (person.id < 2000) {
                arbrePersoLink.href = 'arbrePerso.html?id=' + person.id;
            }
            arbrePersoLink.style.textDecoration = "none";
            arbrePersoLink.style.color = "#999"; 
            arbrePersoLink.style.fontSize = "90%";
            arbrePersoItem.appendChild(arbrePersoLink);
            detailsList.appendChild(arbrePersoItem);
            detailsList.appendChild(document.createElement('br'));
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


//Verifie si la date est connue  
function verifieDate(date) {
    const an = parseInt(date.substr(6, 4));
    const mois = parseInt(date.substr(3, 2));
    const day = parseInt(date.substr(0, 2));
    if (day === 1 && mois === 1) {
        if (an === 1901) {
            return "" ;
        }  else {
            return "dans le courant de l'année " + an;
        }
    } else {
        return "le " + date;
    }
}
