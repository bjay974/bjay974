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
                if (person.genre === "M") {
                    nameItem.classList.add('soustitreM');
                    nameItem.style.color = "rgb(11, 65, 83)";
                }
                else{
                    nameItem.classList.add('soustitreF');
                    nameItem.style.color = "#583a3a";        
                }                
                let nomLegitime = "";
                if (person.nom_legitime) {
                   nomLegitime = person.nom_legitime
                }
                nameItem.innerHTML = `${person.nom} <em>${nomLegitime}</em> ${person.prenom}`;
                detailsList.appendChild(nameItem);
                detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                
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
                    else if (person.lieu_naissance === "Nigéria") {
                        birthDateItem.textContent = `${adjectif_genre} ${dateVerified} au Nigéria`; 
                    }
                    else if (person.lieu_naissance === "Indes") {
                        birthDateItem.textContent = `${adjectif_genre} ${dateVerified} en Indes`; 
                    }
                    else if (person.lieu_naissance === "France") {
                        birthDateItem.textContent = `${adjectif_genre} ${dateVerified} en France`; 
                    }
                    else {
                       birthDateItem.textContent = `${adjectif_genre} ${dateVerified} à ${person.lieu_naissance}`;
                    }
                }
                detailsList.appendChild(birthDateItem);
                detailsList.appendChild(document.createElement('br')); // Ajout d'un espace

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
                    detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                }

                if (!person.date_deces) {
                    detailsList.appendChild(handleAgeNow(person));
                } else {
                    if (person.date_naissance !== "01/01/1901") {
                        if (person.date_deces !== "01/01/1901") {
                            detailsList.appendChild(handleDeathDetails(person));
                        } else {
                            detailsList.appendChild(createDeathDateItem('Date de décès inconnue'));
                        }
                    } else {
                        if (person.date_deces !== "01/01/1901") {
                            detailsList.appendChild(handleDeathDetails(person));
                        } else {
                            detailsList.appendChild(createDeathDateItem('Date de décès inconnue'));
                        }
                    }
                }
                
                // Ajout d'un espace après chaque item
                detailsList.appendChild(document.createElement('br'));

                // Ajouter la date de mariage et le nom si la date n'est pas nulle
                if (person.date_mariage) {
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
                // Charger le ou la conjoint
                else {
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
                
                // Charger la date d'affranchissement 
                if (person.date_affranchi) {
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
                    else {
                        const affranchiDateItem = document.createElement('li');
                        const dateVerified = verifieDate(person.date_affranchi) 
                        const adjectif_genre = ajouterE("Affranchi", person.genre)
                        affranchiDateItem.textContent = `${adjectif_genre} ${dateVerified}`;
                        detailsList.appendChild(affranchiDateItem);
                        detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                    } 

                }
                
                // Charger le père si l'ID du père est défini
                if (person.id_pere !== undefined) {
                    const father = data.find(p => p.id === person.id_pere);
                    if (father) {
                        const relation = person.genre === "M" ? 'Fils de ' : 'Fille de ';
                        addParentToDetailsList(person, father, relation, 'rgb(11, 65, 83)', detailsList);
                    } else {
                        addParentToDetailsList(person, null, 'Père', 'rgb(11, 65, 83)', detailsList);
                    }
                }

                // Charger la mère si l'ID de la mère est défini
                if (person.id_mere !== undefined) {
                    const mother = data.find(p => p.id === person.id_mere);
                    if (mother) {
                        const relation = father ? ' et de ' : (person.genre === "M" ? 'Fils de ' : 'Fille de ');
                        addParentToDetailsList(person, mother, relation, '#583a3a', detailsList);
                    } else {
                        addParentToDetailsList(person, null, 'Mère', '#583a3a', detailsList);
                    }
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
                        // si l'enfant à un nom_legitime alors pn affiche ce nom  : 
                        var nomPers = child.nom_legitime ? child.nom_legitime : child.nom;    
                        nomLink.textContent = `${nomPers} ${child.prenom}`;
                        childItem.appendChild(nomLink);
                        childrenOfPersonUl.appendChild(childItem);
                    });
                    childrenOfPersonList.appendChild(childrenOfPersonUl);
                    detailsList.appendChild(childrenOfPersonList);
                    detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                } 

            // Charger le commentaire
            if (person.commentaire) {
                const commentaireItem = document.createElement('li');
                commentaireItem.classList.add('special-li');
                commentaireItem.textContent = `Notes : ${person.commentaire}`;
                commentaireItem.style.fontSize = 'smaller';
                detailsList.appendChild(commentaireItem);
                detailsList.appendChild(document.createElement('br')); 
            }

            if (person.id < 2000) {
                const arbrePersoLink = document.createElement('a');
                arbrePersoLink.textContent = getArbrePersoLinkText(person.prenom);
                arbrePersoLink.href = `arbrePerso.html?id=${person.id}`;
                arbrePersoLink.style.textDecoration = "none";
                arbrePersoLink.style.color = "#999"; 
                arbrePersoLink.style.fontSize = "80%";
            
                const arbrePersoItem = document.createElement('div'); // Utiliser 'div' pour le conteneur
                arbrePersoItem.appendChild(arbrePersoLink);
                detailsList.appendChild(arbrePersoItem);
                detailsList.appendChild(document.createElement('br'));
            }

              // Charger les liens vers les actes si il y en a
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
                            const afficheMessage = getAfficheMessage(repertoire);
                            ficLink.textContent = `${afficheMessage}`;
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
                                    ficLinkbis.textContent = "2éme partie";
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
            // Charger les liens vers l'acte de mariage au nom du mari 
            if (person.date_mariage && person.genre === "F") {
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
                                    ficLinkbis.textContent = `Deuxième partie`;
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

        personDetails.appendChild(detailsList);

            }      
        })
     
        .catch(error => console.error('Erreur lors du chargement des données JSON:', error));

});

// Fonction pour créer un lien de parent
function createParentLink(parent, color) {
    const nomLink = document.createElement('a');
    nomLink.style.textDecoration = "none";
    if (parent.id < 2000) {
        nomLink.href = `person.html?id=${parent.id}`;
    }
    nomLink.innerHTML = `<span style="color:${color};"><strong>${parent.nom}</strong> ${parent.prenom}</span>`;
    return nomLink;
}

// Fonction pour ajouter un parent à la liste des détails
function addParentToDetailsList(person, parent, relation, color, detailsList) {
    const parentItem = document.createElement('li');
    if (parent) {
        parentItem.appendChild(document.createTextNode(relation));
        parentItem.appendChild(createParentLink(parent, color));
    } else {
        parentItem.innerHTML = `<em>${relation}</em> inconnu`;
    }
    detailsList.appendChild(parentItem);
    detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
}

// Fonction pour déterminer le texte du lien
function getArbrePersoLinkText(prenom) {
    if (!prenom) {
        return "Aperçu de son arbre";
    }
    const prenomVoyelle = ['A', 'E', 'I', 'O', 'U', 'Y'].includes(prenom.charAt(0).toUpperCase());
    return prenomVoyelle
        ? `Aperçu de l'arbre d'${prenom}`
        : `Aperçu de l'arbre de ${prenom}`;
}

function createDeathDateItem(text) {
    const deathDateItem = document.createElement('li');
    deathDateItem.textContent = text;
    return deathDateItem;
}

function handleAgeNow(person) {
    const ageNowItem = document.createElement('li');
    const ageNow = calculeAge(person.date_naissance);
    ageNowItem.classList.add('special-li');
    const adjectif_genre = ajouterE("Agé", person.genre);
    ageNowItem.textContent = `${adjectif_genre} de : ${ageNow} ans `;
    return ageNowItem;
}

function handleDeathDetails(person) {
    const dateVerified = verifieDate(person.date_deces);
    const adjectif_genre = ajouterE("Décédé", person.genre);
    const ageDeces = diffAge(person.date_deces, person.date_naissance);

    if (ageDeces <= 5) {
        if (person.lieu_deces === "Inconnu") {
            return createDeathDateItem(`${adjectif_genre} ${dateVerified}`);
        } else {
            return createDeathDateItem(`${adjectif_genre} ${dateVerified} à ${person.lieu_deces}`);
        }
    } else {
        if (person.lieu_deces === "Inconnu") {
            return createDeathDateItem(`${adjectif_genre} ${dateVerified} à ${ageDeces} ans`);
        } else {
            return createDeathDateItem(`${adjectif_genre} ${dateVerified} à ${ageDeces} ans à ${person.lieu_deces}`);
        }
    }
}

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
            return "(date inconnue) " ;
        }  else {
            return "dans le courant de l'année " + an;
        }
    } else {
        return "le " + date;
    }
}

function getAfficheMessage(repertoire) {
    switch(repertoire){
        case "particulier" : 
            return "Voir l'acte spécial";
            break;
        case "deces":
            return "Voir l'acte de décés";
            break;
        case "naissance":
            return "Voir l'acte de naissance";
            break;
        case "mariage":
            return "Voir l'acte de mariage";
    }
}

