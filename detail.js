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
                    detailsList.appendChild(getAgeNow(person));
                } else {
                    if (person.date_naissance !== "01/01/1901") {
                        if (person.date_deces !== "01/01/1901") {
                            detailsList.appendChild(handleDeathDetails(person));
                        } else {
                            detailsList.appendChild(creerDateDecesItem('Date de décès inconnue'));
                        }
                    } else {
                        if (person.date_deces !== "01/01/1901") {
                            detailsList.appendChild(handleDeathDetails(person));
                        } else {
                            detailsList.appendChild(creerDateDecesItem('Date de décès inconnue'));
                        }
                    }
                }
                
                // Ajout d'un espace après chaque item
                detailsList.appendChild(document.createElement('br'));

                // Ajouter la date de mariage et le conjoint si la date n'est pas nulle
                if (person.date_mariage) {
                    const weddingDateItem = document.createElement('li');
                    const ageMariage = diffAge(person.date_mariage, person.date_naissance);
                    const adjectif_genre = ajouterE("Marié", person.genre);
                    weddingDateItem.textContent = `${adjectif_genre} le ${person.date_mariage} à l'âge de ${ageMariage} ans à ${person.lieu_mariage}`;

                    const conjoint = data.find(p => p.id === person.id_conjoint);
                    if (conjoint) {
                        weddingDateItem.appendChild(document.createTextNode(' à '));
                        const styleColor = conjoint.genre === "M" ? "rgb(11, 65, 83)" : "#583a3a";
                        weddingDateItem.appendChild(creerPersonLink(conjoint, styleColor));
                    }

                    detailsList.appendChild(weddingDateItem);
                    detailsList.appendChild(document.createElement('br'));
                } else if (person.id_conjoint) {
                    const conjoint = data.find(p => p.id === person.id_conjoint);
                    if (conjoint) {
                        const conjointItem = document.createElement('li');
                        const styleColor = conjoint.genre === "M" ? "rgb(11, 65, 83)" : "#583a3a";
                        const texteConjoint = conjoint.genre === "M" ? "Conjoint : " : "Conjointe : ";
                        conjointItem.appendChild(document.createTextNode(texteConjoint));
                        conjointItem.appendChild(creerPersonLink(conjoint, styleColor));

                        detailsList.appendChild(conjointItem);
                        detailsList.appendChild(document.createElement('br'));
                    }
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
                
                // Initialisation des variables father et mother
                let father, mother;
                let textParent = "";

                // Initialisation de la variable pour l'élément de liste temporaire
                let parentItem = null;

                // Charger le père si l'ID du père est défini
                if (person.id_pere) {
                    if (person.id_pere === "inconnu") {
                        parentItem = document.createElement('li');
                        parentItem.appendChild(document.createTextNode('De père inconnu'));
                    } else {
                        father = data.find(p => p.id === person.id_pere);
                        if (father) {
                            textParent = person.genre === "M" ? 'Fils de ' : 'Fille de ';
                            parentItem = document.createElement('li');
                            parentItem.appendChild(document.createTextNode(textParent));
                            parentItem.appendChild(creerPersonLink(father, 'rgb(11, 65, 83)'));
                        }
                    }
                }

                // Charger la mère si l'ID de la mère est défini
                if (person.id_mere) {
                    if (person.id_mere === "inconnue") {
                        if (parentItem) {
                            parentItem.appendChild(document.createTextNode(' et de mère inconnue'));
                        } else {
                            parentItem = document.createElement('li');
                            parentItem.appendChild(document.createTextNode('Mère inconnue'));
                        }
                    } else {
                        mother = data.find(p => p.id === person.id_mere);
                        if (mother) {
                            if (parentItem) {
                                parentItem.appendChild(document.createTextNode(' et de '));
                                parentItem.appendChild(creerPersonLink(mother, '#583a3a'));
                            } else {
                                textParent = person.genre === "M" ? 'Fils de ' : 'Fille de ';
                                parentItem = document.createElement('li');
                                parentItem.appendChild(document.createTextNode(textParent));
                                parentItem.appendChild(creerPersonLink(mother, '#583a3a'));
                            }
                        }
                    }
                }

                // Ajouter l'élément parentItem à la liste des détails si parentItem n'est pas null
                if (parentItem) {
                    detailsList.appendChild(parentItem);
                }

                // Ajouter un espace après le dernier item
                detailsList.appendChild(document.createElement('br'));
                
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
                        // si l'enfant à un nom_legitime alors on affiche ce nom  : 
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
            
            // Charger l'apercu de l'arbre 
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
            chargerLiensActes(person, detailsList);

        personDetails.appendChild(detailsList);

            }      
        })
     
        .catch(error => console.error('Erreur lors du chargement des données JSON:', error));

});

// Fonction pour créer un lien formaté pour une personne (nom + prénom) avec une couleur et un href optionnel
function creerPersonLink(person, color) {
    const nomLink = document.createElement('a');
    nomLink.style.textDecoration = "none";
    if (person.id < 2000) {
        nomLink.href = `person.html?id=${person.id}`;
    }
    nomLink.innerHTML = `<span style="color:${color};"><strong>${person.nom}</strong> ${person.prenom}</span>`;
    return nomLink;
}

// Fonction pour ajouter un parent à la liste des détails
function addParentToDetailsList(textParent, parentLink, detailsList) {
    const parentItem = document.createElement('li');
    parentItem.appendChild(document.createTextNode(textParent));
    parentItem.appendChild(parentLink);
    detailsList.appendChild(parentItem);
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

function creerDateDecesItem(text) {
    const deathDateItem = document.createElement('li');
    deathDateItem.textContent = text;
    return deathDateItem;
}

function getAgeNow(person) {
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
            return creerDateDecesItem(`${adjectif_genre} ${dateVerified}`);
        } else {
            return creerDateDecesItem(`${adjectif_genre} ${dateVerified} à ${person.lieu_deces}`);
        }
    } else {
        if (person.lieu_deces === "Inconnu") {
            return creerDateDecesItem(`${adjectif_genre} ${dateVerified} à ${ageDeces} ans`);
        } else {
            return creerDateDecesItem(`${adjectif_genre} ${dateVerified} à ${ageDeces} ans à ${person.lieu_deces}`);
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

// Fonction pour créer et ajouter des liens pour les fichiers d'actes
function ajouterLienActe(detailsList, nomFichier, repertoire, extension, afficheMessage) {
    const monFichier = `${repertoire}/${nomFichier}.${extension}`;
    return fetch(monFichier).then(response => {
        if (response.ok) {
            const acteItem = document.createElement('a');
            const ficLink = document.createElement('a');
            ficLink.textContent = afficheMessage;
            ficLink.href = monFichier;
            ficLink.target = '_blank';                                  
            ficLink.style.textDecoration = "none";
            ficLink.style.color = "#999"; 
            ficLink.style.fontSize = "90%";
            acteItem.appendChild(ficLink);

            // Vérifier l'existence d'une deuxième partie
            const monFichierBis = `${repertoire}/${nomFichier}_2.${extension}`;
            return fetch(monFichierBis).then(responseBis => {
                if (responseBis.ok) {
                    const ficLinkbis = document.createElement('a');
                    ficLinkbis.textContent = "Deuxième partie";
                    ficLinkbis.href = monFichierBis;                                          
                    ficLinkbis.style.textDecoration = "none";
                    ficLinkbis.style.color = "#999";
                    ficLinkbis.style.fontSize = "90%";
                    acteItem.appendChild(document.createTextNode('  ||  '));
                    acteItem.appendChild(ficLinkbis);
                }
                detailsList.appendChild(acteItem);
                detailsList.appendChild(document.createElement('br'));
            });
        }
    });
}

// Fonction principale pour charger tous les liens vers les actes
function chargerLiensActes(person, detailsList) {
    const nomFichier = person.id;
    const repertoires = ['naissance', 'mariage', 'particulier', 'deces'];
    const extensions = ['pdf', 'jpg', 'jpeg'];

    // Charge les liens pour les répertoires normaux
    repertoires.forEach(repertoire => {
        const afficheMessage = getAfficheMessage(repertoire);
        const promesses = extensions.map(extension => 
            ajouterLienActe(detailsList, nomFichier, repertoire, extension, afficheMessage)
        );
        // Exécuter toutes les promesses pour ce répertoire
        Promise.all(promesses);
    });

    // Charge les liens pour l'acte de mariage au nom du conjoint si applicable
    if (person.date_mariage && person.genre === "F") {
        const nomFichierConjoint = person.id_conjoint;
        const afficheMessage = `Voir l'acte de mariage`;
        const promessesMariage = extensions.map(extension => 
            ajouterLienActe(detailsList, nomFichierConjoint, 'mariage', extension, afficheMessage)
        );
        // Exécuter toutes les promesses pour le mariage du conjoint
        Promise.all(promessesMariage);
    } else {
        detailsList.appendChild(document.createElement('br'));
    }
}
