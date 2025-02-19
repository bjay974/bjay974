let dataMap = new Map();

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const personId = Number(urlParams.get('id'));

    try {
        const response = await fetch('../data/data.json');
        const data = await response.json();
        
        // Création d'une Map pour un accès plus rapide aux personnes par ID
        dataMap = new Map(data.map(person => [person.id, person]));
        
        // Recherche de la personne par ID dans la Map
        const person = dataMap.get(personId);
        if (person) {afficherInfoPersonne(person); } 
    } catch (error) {
        console.error('Erreur lors du chargement des données JSON:', error);
    }
});

function afficherInfoPersonne(person) {
    const personDetails = document.getElementById('person-details');
    const detailsList = document.createElement('li');
    detailsList.classList.add('listPerson');

    ajouterNom(detailsList, person);
    ajouterNaissance(detailsList, person);
    ajouterReconnaissance(detailsList, person);
    ajoutDeces(detailsList, person);
    ajouterMariage(detailsList, person, dataMap);
    ajouterAffranchi(detailsList, person);
    ajouterParents(detailsList, person, dataMap);
    ajouterEnfants(detailsList, person, dataMap);
    ajouterFratrie(detailsList, person, dataMap);
    ajouterCommentaire(detailsList, person);
    ajouterLienArbre(detailsList, person);
    ajouterLiensActes(person, detailsList);

    personDetails.appendChild(detailsList);
}

 // Ajouter le nom et prénom en gras
function ajouterNom(detailsList,person) {
    const nameItem = creerLienNom(person, 'bannierePersonM', 'bannierePersonF', ''); 
    detailsList.appendChild(nameItem);
}  

// Ajouter le lieu et la date de naissance
function ajouterNaissance(detailsList,person) {
    const dateNaissance = creerItem();
    const adjectif_genre = ajouterE("Né", person.genre);
    const dateValide = verifieDate(person.date_naissance);
    const lieuNaissance = afficherLieuDeNaissance(person.lieu_naissance);
    dateNaissance.textContent = `${adjectif_genre} ${dateValide} ${lieuNaissance}`;     
    detailsList.appendChild(dateNaissance);
}

// Ajouter la date de reconnaisance ainsi que le nom
function ajouterReconnaissance(detailsList,person) {
    if (person.date_legitime) {
        const legDateItem = creerItem();
        const dateValide = verifieDate(person.date_legitime);
        const adjectif_genre = ajouterE("Reconnu", person.genre);
    const classeLien = person.genre === "M" ? "lienPersonHEnGras" : "lienPersonFEnGras";
        const nomEnCouleur = `<span class="${classeLien}">${person.nom_legitime}</span>`;
        legDateItem.innerHTML = `${adjectif_genre} <em>${nomEnCouleur}</em> ${dateValide}`;
        detailsList.appendChild(legDateItem);
    }
}

function ajouterParents(detailsList,person,dataMap){
    // Initialisation des variables father et mother
    let textParent = "";
    let parentItem = null;
    // Charger le père si l'ID du père est défini
    if (person.id_pere) {
        parentItem = creerItem("");
        if (person.id_pere === "inconnu") {
            textParent = "De pére inconnu"
            parentItem.appendChild(document.createTextNode(textParent));    }
        else {
            let father = dataMap.get(person.id_pere);
            if (father) {
                textParent = person.genre === "M" ? 'Fils de ' : 'Fille de ';
                parentItem.appendChild(document.createTextNode(textParent));    
                const nomPere = creerLienNom(father, 'lienPersonHEnGras', '', '');
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
                parentItem = creerItem("Mère inconnue");
            }
            parentItem.appendChild(document.createTextNode(textParent)); 
        } else {
           let mother = dataMap.get(person.id_mere);
           if (mother) {
                if (parentItem) {
                    textParent = " et de "
                } else {
                    parentItem = creerItem(person.genre === "M" ? '<i>Fils de</i> ' : '<i>Fille de</i> ');
                }
            }
            parentItem.appendChild(document.createTextNode(textParent)); 
            const nomMere = creerLienNom(mother, '', 'lienPersonFEnGras', '');
            parentItem.appendChild(nomMere);         
        }
    }
    // Ajouter l'élément parentItem à la liste des détails si parentItem n'est pas null
    if (parentItem) {
        detailsList.appendChild(parentItem);
    }
}

// Charger le commentaire
function ajouterCommentaire(detailsList, person){
    if (person.commentaire) {
        const commentaireItem = creerItem(`Notes : ${person.commentaire}`);
        commentaireItem.classList.add('commentairePersonne');
        detailsList.appendChild(commentaireItem);
    }
}

function ajouterLienArbre(detailsList, person){
    // Charger l'apercu de l'arbre 
    if (person.id < 2001 || person.id > 10000) {
        const arbrePersoItem = creerItem("");
        const lienArbrePerso = document.createElement('a');
        lienArbrePerso.href = `../html/arbrePerso.html?id=${person.id}`;
        lienArbrePerso.classList.add('labelArbrePerso' );
        lienArbrePerso.textContent = CreerTexteLienArbre(person.prenom);
        arbrePersoItem.appendChild(lienArbrePerso);
        detailsList.appendChild(arbrePersoItem);
    }
}

function ajouterEnfants(detailsList, person, dataMap) {
    // Récupérer les enfants de la personne si elle est définie comme père ou mère
    const enfants = [];
    // Rechercher dans le map les enfants de cette personne (par id_pere ou id_mere)
    dataMap.forEach((enfant) => {
        if (enfant.id_pere === person.id || enfant.id_mere === person.id) {
            enfants.push(enfant);
        }
    });
    if (enfants.length > 0) {
        enfants.sort((a, b) => b.id - a.id); // Trier les enfants par ID (ordre décroissant)
        
        // Créer un élément li pour contenir la liste des enfants
        const enfantsList = creerItem(enfants.length === 1 ? '<i>Enfant :</i>' : '<i>Enfants :</i>');
        
        // Utiliser un DocumentFragment pour améliorer les performances
        const fragment = document.createDocumentFragment();
        enfants.forEach(enfant => {
            const enfantItem = document.createElement('li');
            const lienEnfant = creerLienNom(enfant, 'lienPersonH', 'lienPersonF', 'listEnfant');
            enfantItem.appendChild(lienEnfant);
            fragment.appendChild(enfantItem);
        });
        enfantsList.appendChild(fragment);
        detailsList.appendChild(enfantsList);
    }
}
           
// Récupérer les frères et sœurs de la personne
function ajouterFratrie(detailsList, person, dataMap) {
    if (person.id < 2001) {
        const fratries = [];
        // Rechercher dans le map les frères et sœurs de cette personne
        dataMap.forEach((fratrie) => {
            // Vérifier les conditions pour le père
            const pereOk = Number.isInteger(person.id_pere);
            const memePere = pereOk && fratrie.id_pere === person.id_pere;
            // Vérifier les conditions pour la mère
            const mereOk = Number.isInteger(person.id_mere);
            const memeMere = mereOk && fratrie.id_mere === person.id_mere;
            // Exclure la personne elle-même et vérifier que les conditions sur les parents sont remplies
            if ((memePere || memeMere) && fratrie.id !== person.id) {
                fratries.push(fratrie);
            }
        });

        if (fratries.length > 0) {
            fratries.sort((a, b) => b.id - a.id); // Trier les frères et sœurs par ID (ordre décroissant)
            const fratriesList = creerItem('<i>Fratrie :</i>');
            const fragment = document.createDocumentFragment();
            
            fratries.forEach(fratrie => {
                const fratrieItem = document.createElement('li');
                const lienFratrie = creerLienNom(fratrie, 'lienPersonH', 'lienPersonF', 'listFratrie');
                fratrieItem.appendChild(lienFratrie);
                fragment.appendChild(fratrieItem);
            });
           fratriesList.appendChild(fragment);
           detailsList.appendChild(fratriesList);
        }
    }
}
          
// Ajouter details du décés ou l'age actuel 
function ajoutDeces(detailsList,person){
    if (!person.date_deces) {
        const ageActuelItem = creerItem("");
        const ageActuel = calculeAge(person.date_naissance);
        const adjectif_genre = ajouterE("Agé", person.genre);
        ageActuelItem.innerHTML += `${adjectif_genre} de : ${ageActuel} ans `;
        detailsList.appendChild(ageActuelItem);  }
    else {
        if (person.date_deces !== "01/01/1901") {
            if (person.date_naissance !== "01/01/1901") {
                const dateValide = verifieDate(person.date_deces);
                const adjectif_genre = ajouterE("Décédé", person.genre);
                const ageDeces = diffAge(person.date_deces, person.date_naissance);
                let decesItem
                if (ageDeces <= 5) {
                    if (person.lieu_deces === "Inconnu") {
                        decesItem = creerItem(`${adjectif_genre} ${dateValide}`);
                    } else {
                        decesItem = creerItem(`${adjectif_genre} ${dateValide} à ${person.lieu_deces}`);
                    }
                } else {
                    if (person.lieu_deces === "Inconnu") {
                        decesItem = creerItem(`${adjectif_genre} ${dateValide} à ${ageDeces} ans`);
                    } else {
                        decesItem = creerItem(`${adjectif_genre} ${dateValide} à ${ageDeces} ans à ${person.lieu_deces}`);
                    }
                }
                decesItem ? detailsList.appendChild(decesItem) : null;
            }
        } else {
            detailsList.appendChild(creerItem('Date de décès inconnue'));    
        }
    }
}

// Ajouter la date de mariage et le conjoint si la date n'est pas nulle
function ajouterMariage(detailsList,person,dataMap) {
    if (person.id_conjoint) {
        let conjoint = dataMap.get(person.id_conjoint);         
        const infoConjoint = creerItem("");
        const nomConjoint = creerLienNom(conjoint, 'lienPersonHEnGras', 'lienPersonFEnGras', '');
        let texteConjoint 
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
    }
}

// Charger la date d'affranchissement 
function ajouterAffranchi(detailsList,person) {
    if (person.date_affranchi) {
        const adjectif_genre = ajouterE("Affranchi", person.genre)
        const dateValide = verifieDate(person.date_affranchi) 
        const affranchiDateItem = creerItem(`${adjectif_genre} ${dateValide}`);
        detailsList.appendChild(affranchiDateItem);
    }
}

// Ajouter les liens des actes
async function ajouterLiensActes(person, detailsList) {
    const nomFichier = person.id;
    const repertoires = ['naissance', 'mariage', 'particulier', 'deces', 'affranchissement'];
    const extensions = ['pdf', 'jpg', 'jpeg'];
    let fichiersExistants = [];

    // Création des promesses pour vérifier les fichiers personnels
    let fetchPromises = repertoires.flatMap(repertoire => 
        extensions.map(async extension => {
            const fichier = `../data/${repertoire}/${nomFichier}.${extension}`;
            try {
                const response = await fetch(fichier, { method: 'HEAD' });
                if (response.ok) {
                    fichiersExistants.push({ fichier, message: getAfficheMessage(repertoire) });
                }
            } catch (error) {
                console.error(`Erreur lors de la récupération du fichier ${fichier}:`, error);
            }
        })
    );

    // Vérification spécifique pour le mariage si la personne est une femme et a un conjoint
    if (person.genre === 'F' && person.conjointId) {
        const nomFichierConjoint = person.conjointId;
        
        // Ajouter les vérifications pour le fichier du mari dans les promesses
        const fetchMariagePromises = extensions.map(async extension => {
            const fichierConjoint = `../data/mariage/${nomFichierConjoint}.${extension}`;
            try {
                const response = await fetch(fichierConjoint, { method: 'HEAD' });
                if (response.ok) {
                    fichiersExistants.push({ fichier: fichierConjoint, message: getAfficheMessage('mariage') });
                }
            } catch (error) {
                console.error(`Erreur lors de la récupération du fichier de mariage du conjoint ${fichierConjoint}:`, error);
            }
        });

        // Ajouter ces nouvelles promesses à la liste globale
        fetchPromises = fetchPromises.concat(fetchMariagePromises);
    }

    // Attendre que toutes les vérifications soient terminées
    await Promise.all(fetchPromises);

    // Affichage des fichiers existants
    fichiersExistants.forEach(({ fichier, message }) => {
        const acteItem = creerItem("");
        const lienFichier = document.createElement('a');
        lienFichier.classList.add('lienFichier');
        lienFichier.textContent = message;
        lienFichier.href = fichier;
        acteItem.appendChild(lienFichier);
        detailsList.appendChild(acteItem);
    });
}

function creerLienNom(person, lienHomme, lienFemme, laClasse) {
    const lienPersonne = document.createElement('a');
     // Déterminer le nom à afficher (priorité au nom légitime)
    const nomPersonne = person?.nom_legitime 
        ? `${person.nom_legitime} (${person.nom || ""})`.trim() 
        : person?.nom || "";
        // Déterminer l'URL en fonction de l'ID de la personne
    lienPersonne.href = person.id < 2001 ? `../html/person.html?id=${person.id}` : '#';
        // Mettre à jour le texte du lien
    lienPersonne.textContent = `${nomPersonne} ${person.prenom}`;
        // Ajouter la classe en fonction du genre
    const classeGenre = person.genre === 'M' ? lienHomme : lienFemme;
    lienPersonne.classList.add(classeGenre);
        // Ajouter la classe supplémentaire si elle est fournie
    if (laClasse) {
        lienPersonne.classList.add(laClasse);
    }
    return lienPersonne; 
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
        case "Portugal":
            return " au Portugal";
            break;
        case "Pays Bas":
            return " en Hollande";
            break;                            
        case "Inconnu":
            return "";
            break;
        default:
            return "à " + lieuNaissance;
    }
}

function diffAge(date1, date2) {   
    const an1 = parseInt(date1.substr(6, 4));
    const mois1 = parseInt(date1.substr(3, 2));
    const day1 = parseInt(date1.substr(0, 2));
    const an2 = parseInt(date2.substr(6, 4));
    const mois2 = parseInt(date2.substr(3, 2));
    const day2 = parseInt(date2.substr(0, 2));
    const dateNaissance = new Date(an2, mois2 - 1, day2); 
    const newDate1 = new Date(an1, mois1 - 1, day1);
    const ageDiff = newDate1 - dateNaissance.getTime(); 
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970); 
}

// Fonction pour déterminer le texte du lien
function CreerTexteLienArbre(prenom) {
    if (!prenom) { return "Aperçu de son arbre"}
    const prenomVoyelle = ['A', 'E', 'I', 'O', 'U', 'Y'].includes(prenom.charAt(0).toUpperCase());
    return prenomVoyelle
        ? `Aperçu de l'arbre d'${prenom}`
        : `Aperçu de l'arbre de ${prenom}`;
}

function creerItem(htmlContent) {
    const itemParagraphe = document.createElement('p');
    itemParagraphe.innerHTML = htmlContent; 
    itemParagraphe.classList.add('affichePerson');
    return itemParagraphe;
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
        case "affranchissement":
            return "Voir l'acte d'affranchissement";            
    }
}
