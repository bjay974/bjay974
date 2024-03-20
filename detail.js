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
                nameItem.textContent = `${person.nom} ${person.prenom}`;
                detailsList.appendChild(nameItem);

                // Ajouter la date de naissance
                const birthDateItem = document.createElement('li');
                const adjectif_genre = ajouterE("Né", person.genre)
                const dateVerified = verifieDate(person.date_naissance) 
                birthDateItem.textContent = `${adjectif_genre} ${dateVerified} à ${person.lieu_naissance}`;
                detailsList.appendChild(birthDateItem);  

                // Ajouter la date de mariage et le nom si la date n'est pas nulle
                if (person.date_mariage !== null) {
                    const weddingDateItem = document.createElement('li');
                    const ageMariage = diffAge(person.date_mariage, person.date_naissance);
                    const adjectif_genre = ajouterE("Marié", person.genre)
                    weddingDateItem.textContent = `${adjectif_genre} le ${person.date_mariage} à l'âge de ${ageMariage} ans dans la ville de ${person.lieu_mariage}`;
                    detailsList.appendChild(weddingDateItem);  
                }
                // Ajouter la date de décès si elle n'est pas nulle
                if (person.date_deces !== null) {
                  //  const deathDateItem = document.createElement('li');
                    const ageDeces = diffAge(person.date_deces, person.date_naissance);
                    const dateVerified = verifieDate(person.date_deces) 
                    const adjectif_genre = ajouterE("Décédé", person.genre)
                    deathDateItem.textContent = `${adjectif_genre} ${dateVerified} à l'âge de ${ageDeces} ans dans la ville de ${person.lieu_deces}`;
                    detailsList.appendChild(deathDateItem);
                    detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                }
                else {
                    const ageNowItem = document.createElement('li');
                    const ageNow = calculeAge(person.date_naissance);
                    const adjectif_genre = ajouterE("Agé", person.genre)
                    ageNowItem.textContent = `${adjectif_genre} de : ${ageNow} ans `;
                    detailsList.appendChild(ageNowItem);
                    detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                 }
                
                // Charger le père si l'ID du père est défini
                if (person.id_pere) {
                    const father = data.find(p => p.id === person.id_pere);
                    if (father) {
                        const fatherItem = document.createElement('li');
                        const adjectif_genre = ajouterParent(person.genre)
                        fatherItem.innerHTML = `<strong><em>${adjectif_genre}</em></strong> de ${father.nom} ${father.prenom}`;
                        detailsList.appendChild(fatherItem);
                    } 
                } else {
                    const fatherItem = document.createElement('li');
                    fatherItem.innerHTML = "Père inconnu";
                    detailsList.appendChild(fatherItem);
                }

              // Charger la mère si l'ID de la mère est défini
                if (person.id_mere) {
                    const mother = data.find(p => p.id === person.id_mere);
                    if (mother) {
                 //       const motherItem = document.createElement('li');
                        const adjectif_genre = ajouterParent(person.genre)
                        motherItem.innerHTML = `<strong><em>${adjectif_genre}</em></strong> de ${father.nom} ${father.prenom}`;
                        detailsList.appendChild(motherItem);
                        detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                    }
                } else {
                    const motherItem = document.createElement('li');
                    motherItem.innerHTML = "Mère inconnue";
                    detailsList.appendChild(motherItem);
                    detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                }          
                
                // Charger le ou la conjoint
                if (person.id_conjoint) {
                    const conjoint = data.find(p => p.id === person.id_conjoint);
                    if (conjoint) {
                        const conjointItem = document.createElement('li');
                        const adjectif_genre = ajouterEgenreM("Conjoint", person.genre)
                        conjointItem.innerHTML = `<strong>${adjectif_genre}</strong> : ${conjoint.nom} ${conjoint.prenom}`;
                        detailsList.appendChild(conjointItem);
                        detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                     } 
                } 

                // Ajouter l'origine
                if (person.origine !== null) {
                    const origineItem = document.createElement('li');
                    origineItem.textContent = `Pays d'origine : ${person.origine}`;
                    detailsList.appendChild(origineItem);
                    detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                }

                // Ajouter l'affranchissement 
                if (person.affranchi !== null) {
                    const affranchissementItem = document.createElement('li');
                    affranchissementItem.textContent = `Affranchi en 1848`;
                    detailsList.appendChild(affranchissementItem);
                    detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                }                

                // Récupérer les enfants de la personne si elle est définie comme père ou mère
                const childrenOfPerson = data.filter(child => child.id_pere === person.id || child.id_mere === person.id);
                if (childrenOfPerson.length > 0) {
                    const childrenOfPersonList = document.createElement('li');
                    childrenOfPersonList.textContent = "Enfant(s) :";
                    const childrenOfPersonUl = document.createElement('ul');
                    childrenOfPerson.forEach(child => {
                      //  const childItem = document.createElement('li');
                        childItem.textContent = `${child.nom} ${child.prenom}`;
                        childrenOfPersonUl.appendChild(childItem);
                    });
                    childrenOfPersonList.appendChild(childrenOfPersonUl);
                    detailsList.appendChild(childrenOfPersonList);
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


