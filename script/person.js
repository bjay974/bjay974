document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const personneId = urlParams.get('id');

    fetch('../data/data.json')
        .then(response => response.json())
        .then(donnees => afficherDetailsPersonne(donnees, personneId))
        .catch(erreur => console.error('Erreur lors du chargement des données JSON:', erreur));
});

function afficherDetailsPersonne(donnees, personneId) {
    const personne = donnees.find(p => p.id === parseInt(personneId));
    const detailsPersonne = document.getElementById('personne-detail');

    if (!personne) return;

    const listeDetails = document.createElement('li');
    listeDetails.classList.add('listPerson');

    ajouterNom(listeDetails, personne);
    ajouterDetailsNaissance(listeDetails, personne);
    ajouterDetailsReconnaissance(listeDetails, personne);
    ajouterDetailsDeces(listeDetails, personne);
    ajouterDetailsMariage(listeDetails, personne, donnees);
    ajouterDetailsAffranchissement(listeDetails, personne);
    ajouterDetailsParents(listeDetails, personne, donnees);
    ajouterDetailsEnfants(listeDetails, personne, donnees);
    ajouterDetailsFratrie(listeDetails, personne, donnees);
    ajouterCommentaire(listeDetails, personne);
    ajouterLienArbreGenealogique(listeDetails, personne);
    chargerLiensActes(listeDetails, personne);

    detailsPersonne.appendChild(listeDetails);
}

function ajouterNom(listeDetails, personne) {
    const elementNom = document.createElement('h3');
    elementNom.classList.add(personne.genre === 'M' ? 'bannierePersonM' : 'bannierePersonF');
    const nomLegitime = personne.nom_legitime ?? "";
    elementNom.innerHTML = `${personne.nom} <em>${nomLegitime}</em> ${personne.prenom}`;
    listeDetails.appendChild(elementNom);
    listeDetails.appendChild(document.createElement('br'));
}

function ajouterDetailsNaissance(listeDetails, personne) {
    const elementDateNaissance = creerElementDetail();
    const adjectifGenre = ajouterSuffixeGenre("Né", personne.genre);
    const dateValide = verifierDate(personne.date_naissance);
    const lieuNaissance = afficherLieuNaissance(personne.lieu_naissance);
    elementDateNaissance.textContent = `${adjectifGenre} ${dateValide} ${lieuNaissance}`;
    listeDetails.appendChild(elementDateNaissance);
    listeDetails.appendChild(document.createElement('br'));
}

function ajouterDetailsReconnaissance(listeDetails, personne) {
    if (!personne.date_legitime) return;

    const elementDateReconnaissance = creerElementDetail();
    const dateValide = verifierDate(personne.date_legitime);
    const adjectifGenre = ajouterSuffixeGenre("Reconnu", personne.genre);
    const classeLien = personne.genre === "M" ? "lienPersonHEnGras" : "lienPersonFEnGras";
    const nomEnCouleur = `<span class="${classeLien}">${personne.nom_legitime}</span>`;
    elementDateReconnaissance.innerHTML = `${adjectifGenre} <em>${nomEnCouleur}</em> ${dateValide}`;
    listeDetails.appendChild(elementDateReconnaissance);
}

function ajouterDetailsDeces(listeDetails, personne) {
    if (!personne.date_deces) {
        listeDetails.appendChild(creerElementDetail(`Âgé de : ${calculerAgeActuel(personne.date_naissance)} ans`));
    } else if (personne.date_deces !== "01/01/1901") {
        const ageAuDeces = calculerDifferenceAge(personne.date_deces, personne.date_naissance);
        const detailsDeces = creerTexteDetailsDeces(personne, ageAuDeces);
        if (detailsDeces) listeDetails.appendChild(creerElementDetail(detailsDeces));
    } else {
        listeDetails.appendChild(creerElementDetail('Date de décès inconnue'));
    }
}

function creerTexteDetailsDeces(personne, ageAuDeces) {
    const dateValide = verifierDate(personne.date_deces);
    const adjectifGenre = ajouterSuffixeGenre("Décédé", personne.genre);
    const lieuDeces = personne.lieu_deces !== "Inconnu" ? `à ${personne.lieu_deces}` : "";

    if (ageAuDeces <= 5) {
        return `${adjectifGenre} ${dateValide} ${lieuDeces}`;
    } else {
        return `${adjectifGenre} ${dateValide} à ${ageAuDeces} ans ${lieuDeces}`;
    }
}

function ajouterDetailsMariage(listeDetails, personne, donnees) {
    if (!personne.id_conjoint) return;

    const conjoint = donnees.find(p => p.id === personne.id_conjoint);
    if (!conjoint) return;

    const texteMariage = personne.date_mariage ? 
        `${ajouterSuffixeGenre("Marié", personne.genre)} le ${personne.date_mariage} (à ${calculerDifferenceAge(personne.date_mariage, personne.date_naissance)} ans) à ` : 
        (conjoint.genre === "M" ? "Conjoint : " : "Conjointe : ");

    const detailsMariage = creerElementDetail(texteMariage);
    detailsMariage.appendChild(creerLienPersonne(conjoint, 'lienPersonHEnGras', 'lienPersonFEnGras'));
    listeDetails.appendChild(detailsMariage);
}

function ajouterDetailsAffranchissement(listeDetails, personne) {
    if (!personne.date_affranchi) return;

    const elementAffranchissement = creerElementDetail(`${ajouterSuffixeGenre("Affranchi", personne.genre)} ${verifierDate(personne.date_affranchi)}`);
    listeDetails.appendChild(elementAffranchissement);
}

function ajouterDetailsParents(listeDetails, personne, donnees) {
    let texteParents = "";
    const elementParents = creerElementDetail("");

    if (personne.id_pere) {
        texteParents = ajouterDetailsPere(personne, donnees);
        elementParents.innerHTML = texteParents;
    }

    if (personne.id_mere) {
        const texteMere = ajouterDetailsMere(personne, donnees);
        elementParents.innerHTML += texteMere;
    }

    if (elementParents.innerHTML) {
        listeDetails.appendChild(elementParents);
    }
}

function ajouterDetailsPere(personne, donnees) {
    if (personne.id_pere === "inconnu") {
        return "De père inconnu";
    } else {
        const pere = donnees.find(p => p.id === personne.id_pere);
        return pere ? `${personne.genre === "M" ? 'Fils de ' : 'Fille de '} ${creerLienPersonne(pere, 'lienPersonHEnGras', '')}` : '';
    }
}

function ajouterDetailsMere(personne, donnees) {
    if (personne.id_mere === "inconnue") {
        return personne.id_pere ? " et de mère inconnue" : "Mère inconnue";
    } else {
        const mere = donnees.find(p => p.id === personne.id_mere);
        return mere ? ` et de ${creerLienPersonne(mere, '', 'lienPersonFEnGras')}` : '';
    }
}

function ajouterDetailsEnfants(listeDetails, personne, donnees) {
    const enfants = donnees.filter(enfant => enfant.id_pere === personne.id || enfant.id_mere === personne.id);

    if (!enfants.length) return;

    enfants.sort((a, b) => b.id - a.id);
    const listeEnfants = creerElementDetail(enfants.length === 1 ? '<i>Enfant :</i>' : '<i>Enfants :</i>');

    const fragment = document.createDocumentFragment();
    enfants.forEach(enfant => {
        const elementEnfant = document.createElement('li');
        elementEnfant.appendChild(creerLienPersonne(enfant, 'lienPersonH', 'lienPersonF'));
        fragment.appendChild(elementEnfant);
    });

    listeEnfants.appendChild(fragment);
    listeDetails.appendChild(listeEnfants);
}

function ajouterDetailsFratrie(listeDetails, personne, donnees) {
    if (personne.id >= 2000) return;

    const fratrie = donnees.filter(frat => 
        ((Number.isInteger(personne.id_pere) && frat.id_pere === personne.id_pere) ||
        (Number.isInteger(personne.id_mere) && frat.id_mere === personne.id_mere)) &&
        frat.id !== personne.id
    );

    if (!fratrie.length) return;

    fratrie.sort((a, b) => b.id - a.id);
    const listeFratrie = creerElementDetail(`<i>Fratrie :</i>`);

    const fragment = document.createDocumentFragment();
    fratrie.forEach(frat => {
        const elementFrat = document.createElement('li');
        elementFrat.appendChild(creerLienPersonne(frat, 'lienPersonH', 'lienPersonF'));
        fragment.appendChild(elementFrat);
    });

    listeFratrie.appendChild(fragment);
    listeDetails.appendChild(listeFratrie);
}

function ajouterCommentaire(listeDetails, personne) {
    if (!personne.commentaire) return;

    const elementCommentaire = creerElementDetail(`Notes : ${personne.commentaire}`);
    elementCommentaire.classList.add('commentairePersonne');
    listeDetails.appendChild(elementCommentaire);
}

function ajouterLienArbreGenealogique(listeDetails, personne) {
    if (personne.id >= 2000) return;

    const lienArbre = document.createElement('a');
    lienArbre.href = `../html/arbrePerso.html?id=${personne.id}`;
    lienArbre.classList.add('labelArbrePerso');
    lienArbre.textContent = creerTexteLienArbre(personne.prenom);
    listeDetails.appendChild(lienArbre);
}

function creerTexteLienArbre(prenom) {
    if (!prenom) {
        return "Aperçu de son arbre";
    }
    const prenomVoyelle = ['A', 'E', 'I', 'O', 'U', 'Y'].includes(prenom.charAt(0).toUpperCase());
    return prenomVoyelle
        ? `Aperçu de l'arbre d'${prenom}`
        : `Aperçu de l'arbre de ${prenom}`;
}

function ajouterSuffixeGenre(baseTexte, genre) {
    return genre === 'M' ? baseTexte : baseTexte + 'e';
}

function creerElementDetail(texte = '') {
    const elementDetail = document.createElement('div');
    elementDetail.classList.add('detailPersonne');
    elementDetail.innerHTML = texte;
    return elementDetail;
}

function creerLienPersonne(personne, classeLienH, classeLienF) {
    const lienPersonne = document.createElement('a');
    lienPersonne.href = `../html/person.html?id=${personne.id}`;
    lienPersonne.classList.add(personne.genre === 'M' ? classeLienH : classeLienF);
    lienPersonne.textContent = `${personne.prenom} ${personne.nom}`;
    return lienPersonne;
}

function verifierDate(date) {
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

function calculerAgeActuel(dateNaissance) {
    const dateNaissanceObj = new Date(dateNaissance);
    const age = new Date().getFullYear() - dateNaissanceObj.getFullYear();
    return age;
}

function calculerDifferenceAge(date1, date2) {
    const date1Obj = new Date(date1);
    const date2Obj = new Date(date2);
    const difference = date1Obj.getFullYear() - date2Obj.getFullYear();
    return difference;
}

function afficherLieuNaissance(lieuNaissance) {
    return lieuNaissance && lieuNaissance !== "Inconnu" ? `à ${lieuNaissance}` : "";
}

// Fonction principale pour charger tous les liens vers les actes
function chargerLiensActes(listeDetails, personne) {
    const nomFichier = personne.id;
    const repertoires = ['naissance', 'mariage', 'particulier', 'deces'];
    const extensions = ['pdf', 'jpg', 'jpeg'];

    // Charge les liens pour les répertoires normaux
    repertoires.forEach(repertoire => {
        const afficheMessage = getAfficheMessage(repertoire);
        const promesses = extensions.map(extension => 
            ajouterlienFichier(listeDetails, nomFichier, repertoire, extension, afficheMessage)
        );
        // Exécuter toutes les promesses pour ce répertoire
        Promise.all(promesses);
    });

    // Charge les liens pour l'acte de mariage au nom du conjoint si applicable
    if (personne.date_mariage && personne.genre === "F") {
        const nomFichierConjoint = person.id_conjoint;
        const afficheMessage = `Voir l'acte de mariage`;
        const promessesMariage = extensions.map(extension => 
            ajouterlienFichier(listeDetails, nomFichierConjoint, 'mariage', extension, afficheMessage)
        );
        // Exécuter toutes les promesses pour le mariage du conjoint
        Promise.all(promessesMariage);
    } else {
        listeDetails.appendChild(document.createElement('br'));
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
function ajouterlienFichier(listeDetails, nomFichier, repertoire, extension, afficheMessage) {
    const monFichierComplet = `../${repertoire}/${nomFichier}.${extension}`;
    return fetch(monFichierComplet).then(response => {
        if (response.ok) {
            const acteItem = document.createElement('a');
            const lienFichier = document.createElement('a');
            lienFichier.classList.add('lienFichier')
            lienFichier.textContent = afficheMessage;
            lienFichier.href = monFichierComplet;
            acteItem.appendChild(lienFichier);
            // Vérifier l'existence d'une deuxième partie
            const monFichierBis = `../${repertoire}/${nomFichier}_2.${extension}`;
            return fetch(monFichierBis).then(responseBis => {
                if (responseBis.ok) {
                    const lienFichierbis = document.createElement('a');
                    lienFichierbis.classList.add('lienFichier')
                    lienFichierbis.textContent = "Deuxième partie";
                    lienFichierbis.href = monFichierBis;                                          
                    acteItem.appendChild(document.createTextNode('  ||  '));
                    acteItem.appendChild(lienFichierbis);
                }
                listeDetails.appendChild(acteItem);
                listeDetails.appendChild(document.createElement('br'));
            });
         
        }
    });
}