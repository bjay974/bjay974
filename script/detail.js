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
                    nameItem.classList.add('soustitreM' );
                }
                else{
                    nameItem.classList.add('soustitreF');
                }                
                let nomLegitime = "";
                if (person.nom_legitime) {
                    nomLegitime = person.nom_legitime
                }
                nameItem.innerHTML = `${person.nom} <em>${nomLegitime}</em> ${person.prenom}`;
                detailsList.appendChild(nameItem);
                detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                
                // Ajouter le lieu et la date de naissance
                const birthDateItem = document.createElement('span');
                birthDateItem.classList.add('afficheDetail');
                const adjectif_genre = ajouterE("Né", person.genre);
                const dateValide = verifieDate(person.date_naissance);
                const lieuNaissance = afficherLieuDeNaissance(person.lieu_naissance);
                birthDateItem.textContent = `${adjectif_genre} ${dateValide} ${lieuNaissance} '.'`;     
                detailsList.appendChild(birthDateItem);
                detailsList.appendChild(document.createElement('br')); 

                // Ajouter la date de reconnaisance ainsi que le nom
                if (person.date_legitime) {
                    const legDateItem = document.createElement('p');
                    legDateItem.classList.add('afficheDetail');
                    const dateValide = verifieDate(person.date_legitime);
                    const adjectif_genre = ajouterE("Reconnu", person.genre);
                    const linkClass = person.genre === "M" ? "lienHommeEnGras" : "lienFemmeEnGras";
                    const nomEnCouleur = `<span class="${linkClass}">${person.nom_legitime}</span>`;
                    legDateItem.innerHTML = `${adjectif_genre} <em>${nomEnCouleur}</em> ${dateValide} '.'`;
                    detailsList.appendChild(legDateItem);
                    detailsList.appendChild(document.createElement('br')); 
                }

                if (!person.date_deces) {
                    detailsList.appendChild(getAgeActuel(person));
                    detailsList.appendChild(document.createElement('br'));
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
                    detailsList.appendChild(document.createElement('br'));
                }
               
                // Ajouter la date de mariage et le conjoint si la date n'est pas nulle
                if (person.id_conjoint) {
                    const conjoint = data.find(p => p.id === person.id_conjoint);
                    const infoConjoint = document.createElement('p');
                    infoConjoint.classList.add('afficheDetail');
                    const nomConjoint = creerPersonLink(conjoint); 
                    let texteConjoint 
                    nomConjoint.classList.add(conjoint.genre === 'M' ? 'lienHomme' : 'lienFemme');
                    if (person.date_mariage) {
                        const ageMariage = diffAge(person.date_mariage, person.date_naissance);
                        const adjectif_genre = ajouterE("Marié", person.genre);
                        texteConjoint = `${adjectif_genre} le ${person.date_mariage} (à ${ageMariage} ans) à `;
                    } else {
                        texteConjoint = conjoint.genre === "M" ? "Conjoint : " : "Conjointe : ";
                    }
                    infoConjoint.appendChild(document.createTextNode(texteConjoint));
                    infoConjoint.appendChild(nomConjoint); 
                    detailsList.appendChild(infoConjoint);
                    detailsList.appendChild(document.createElement('br'));
                }
           
                // Charger la date d'affranchissement 
                if (person.date_affranchi) {
                    const affranchiDateItem = document.createElement('p');
                    affranchiDateItem.classList.add('afficheDetailx');
                    const dateValide = verifieDate(person.date_affranchi) 
                    const adjectif_genre = ajouterE("Affranchi", person.genre)
                    affranchiDateItem.textContent = `${adjectif_genre} ${dateValide}`;
                    detailsList.appendChild(affranchiDateItem);
                    detailsList.appendChild(document.createElement('br')); 
                }

                // Initialisation des variables father et mother
                let father, mother;
                let textParent = "";
                let parentItem = null;
                let pereItem
                let mereItem
                // Charger le père si l'ID du père est défini
                if (person.id_pere) {
                    parentItem = document.createElement('p');
                    parentItem.classList.add('afficheDetail');
                    if (person.id_pere === "inconnu") {
                        textParent = "De pére inconnu"
                        parentItem.appendChild(document.createTextNode(textParent));  
                    } else {
                        father = data.find(p => p.id === person.id_pere);
                        if (father) {
                            textParent = person.genre === "M" ? 'Fils de ' : 'Fille de ';
                            parentItem.appendChild(document.createTextNode(textParent));    
                            nomPere.appendChild(creerPersonLink(father));
                            nomPere.classList.add('lienHomme');
                            parentItem.appendChild(nomPere); 
                        }
                    }
                }
                // Charger la mère si l'ID de la mère est défini
                if (person.id_mere) {
                    if (person.id_mere === "inconnue") {
                        if (parentItem) {
                            textParent = " et de mère inconnue"
                        } else {
                            parentItem = document.createElement('p');
                            parentItem.classList.add('afficheDetail');
                            textParent = "Mère inconnue"
                        }
                        parentItem.appendChild(document.createTextNode(textParent)); 
                    } else {
                        mother = data.find(p => p.id === person.id_mere);
                        if (mother) {
                            if (parentItem) {
                                textParent = " et de "
                            } else {
                                parentItem = document.createElement('p');
                                parentItem.classList.add('afficheDetail');
                                textParent = person.genre === "M" ? 'Fils de ' : 'Fille de ';
                            }
                        }
                        parentItem.appendChild(document.createTextNode(textParent)); 
                        const nomMere= appendChild(creerPersonLink(mother));
                        nomMere.classList.add('lienFemme');
                        parentItem.appendChild(nomMere);         
                    }
                }
                // Ajouter l'élément parentItem à la liste des détails si parentItem n'est pas null
                if (parentItem) {
                    detailsList.appendChild(parentItem);
                    detailsList.appendChild(document.createElement('br'));
                }
          
                // Récupérer les enfants de la personne si elle est définie comme père ou mère
                const childrenOfPerson = data.filter(child => child.id_pere === person.id || child.id_mere === person.id);
                if (childrenOfPerson.length > 0) {
                    childrenOfPerson.sort((a, b) => b.id - a.id);
                    // Créer un élément li pour contenir la liste des enfants
                    const childrenOfPersonList = document.createElement('p');
                    childrenOfPersonList.classList.add('afficheDetail');
                    childrenOfPersonList.innerHTML = `${childrenOfPerson.length === 1 ? 'Enfant' : 'Enfants'} :`;
                    // Utiliser un DocumentFragment pour améliorer les performances
                    const fragment = document.createDocumentFragment();
                    const childrenOfPersonUl = document.createElement('ul');
                    childrenOfPersonUl.classList.add('list');
                    childrenOfPerson.forEach(child => {
                        const childItem = document.createElement('li');
                        const nomLink = document.createElement('a');
                        const nomPers = child.nom_legitime || child.nom;    
                        nomLink.href = child.id < 2000 ? `person.html?id=${child.id}` : '#';
                        nomLink.textContent = `${nomPers} ${child.prenom}`;
                        nomLink.classList.add(child.genre === 'M' ? 'lienHommeEnGras' : 'lienFemmeEnGras'); 
                        nomLink.classList.add('smaller');
                        childItem.appendChild(nomLink);
                        fragment.appendChild(childItem);
                    });
                    childrenOfPersonUl.appendChild(fragment);
                    childrenOfPersonList.appendChild(childrenOfPersonUl);
                    detailsList.appendChild(childrenOfPersonList);
                    detailsList.appendChild(document.createElement('br'));
                }

                // Récupérer les frères et sœurs de la personne
                if (person.id < 2000) {
                    const fratries = data.filter(fratrie => {
                        // Vérifier les conditions pour le père
                        const pereOk = Number.isInteger(person.id_pere);
                        const memePere = pereOk && fratrie.id_pere === person.id_pere;
                        // Vérifier les conditions pour la mère
                        const mereOk = Number.isInteger(person.id_mere);
                        const memeMere = mereOk && fratrie.id_mere === person.id_mere;
                        // Exclure la personne elle-même et retourner true si l'un des parents correspond et est valide
                        return (memePere || memeMere) && fratrie.id !== person.id;
                    });
                    if (fratries.length > 0) {
                        fratries.sort((a, b) => b.id - a.id); // Trier les frères et sœurs par ID 
                        const fratriesList = document.createElement('p');
                        fratriesList.classList.add('afficheDetail');
                        fratriesList.innerHTML = `${fratries.length === 1 ? 'Frère ou sœur' : 'Frères et sœurs'} :`;
                        const fragment = document.createDocumentFragment();
                        const fratriesUl = document.createElement('ul');
                        fratries.forEach(fratrie => {
                            const fratrieItem = document.createElement('li');
                            fratrieItem.classList.add('list');
                            const nomLink = document.createElement('a');
                            const nomPers = fratrie.nom_legitime || fratrie.nom;
                            nomLink.href = fratrie.id < 2000 ? `person.html?id=${fratrie.id}` : '#';
                            nomLink.textContent = `${nomPers} ${fratrie.prenom}`;
                            nomLink.classList.add(fratrie.genre === 'M' ? 'lienHomme' : 'lienFemme');
                            nomLink.classList.add('smaller');
                            fratrieItem.appendChild(nomLink);
                            fragment.appendChild(fratrieItem);
                        });
                        fratriesUl.appendChild(fragment);
                        fratriesList.appendChild(fratriesUl);
                        detailsList.appendChild(fratriesList);
                        detailsList.appendChild(document.createElement('br')); 
                    }
                }

                // Charger le commentaire
                if (person.commentaire) {
                    const commentaireItem = document.createElement('li');
                    commentaireItem.classList.add('list');
                    commentaireItem.textContent = `Notes : ${person.commentaire}`;
                    commentaireItem.classList.add('smaller');
                    detailsList.appendChild(commentaireItem);
                    detailsList.appendChild(document.createElement('br')); 
                }
                // Charger l'apercu de l'arbre 
                if (person.id < 2000) {
                    const arbrePersoLink = document.createElement('a');
                    arbrePersoLink.textContent = getArbrePersoLinkText(person.prenom);
                    arbrePersoLink.href = `arbrePerso.html?id=${person.id}`;
                    arbrePersoLink.classList.add('labelArbre' );
                    const arbrePersoItem = document.createElement('div'); 
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
function creerPersonLink(person) {
    const nomLink = document.createElement('a');
    nomLink.style.textDecoration = "none";
    if (person.id < 2000) {
        nomLink.href = `person.html?id=${person.id}`;
    }
    nomLink.innerHTML = `<span><strong>${person.nom}</strong> ${person.prenom}</span>`;
    return nomLink;
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
    deathDateItem.classList.add('list')
    return deathDateItem;
}

function getAgeActuel(person) {
    const ageNowItem = document.createElement('li');
    const ageNow = calculeAge(person.date_naissance);
    ageNowItem.classList.add('list');
    const adjectif_genre = ajouterE("Agé", person.genre);
    ageNowItem.textContent = `${adjectif_genre} de : ${ageNow} ans `;
    return ageNowItem;
}

function handleDeathDetails(person) {
    const dateValide = verifieDate(person.date_deces);
    const adjectif_genre = ajouterE("Décédé", person.genre);
    const ageDeces = diffAge(person.date_deces, person.date_naissance);
    if (ageDeces <= 5) {
        if (person.lieu_deces === "Inconnu") {
            return creerDateDecesItem(`${adjectif_genre} ${dateValide}`);
        } else {
            return creerDateDecesItem(`${adjectif_genre} ${dateValide} à ${person.lieu_deces}`);
        }
    } else {
        if (person.lieu_deces === "Inconnu") {
            return creerDateDecesItem(`${adjectif_genre} ${dateValide} à ${ageDeces} ans`);
        } else {
            return creerDateDecesItem(`${adjectif_genre} ${dateValide} à ${ageDeces} ans à ${person.lieu_deces}`);
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

// Fonction pour affecter le lieu de naissance
function afficherLieuDeNaissance(lieuNaissance) {
    switch(lieuNaissance){
        case "Afrique" : 
            return " en Afrique";
            break;
        case "Nigéria":
            return " au Nigéria";
            break;
        case "Indes":
            return " en Indes";
            break;
        case "France":
            return " en France";
            break;
        case "Inconnu":
            return "";
            break;
        default:
            return "à " + lieuNaissance;
    }
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
