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
                    const deathDateItem = document.createElement('li');
                    const ageDeces = diffAge(person.date_deces, person.date_naissance);
                    const dateVerified = verifieDate(person.date_deces) 
                    const adjectif_genre = ajouterE("Décédé", person.genre)
                    deathDateItem.textContent = `${adjectif_genre} ${dateVerified} à l'âge de ${ageDeces} ans dans la ville de ${person.lieu_deces}`;
                    detailsList.appendChild(deathDateItem);  
                }
                else {
                    const ageNowItem = document.createElement('li');
                    const ageNow = calculeAge(person.date_naissance);
                    ageNowItem.textContent = `Âge : ${ageNow} ans `;
                    detailsList.appendChild(ageNowItem);                    
                 }
                
                // Ajouter le nom du conjoint 
                if (person.nom_conjoint !== null) {
                    if (person.date_mariage !== null) {
                        if (person.genre == "F") {
                            const epouxNameItem = document.createElement('li');
                            epouxNameItem.textContent = `Epoux : ${person.nom_epouse} ${person.prenom_conjoint} `;
                            detailsList.appendChild(epouxNameItem); 
                            }
                        else {
                            const epouseNameItem = document.createElement('li');
                            epouseNameItem.textContent = `Epouse : ${person.nom_conjoint} ${person.prenom_conjoint} `;
                            detailsList.appendChild(epouseNameItem); }
                        }
                    else {
                            const conjointNameItem = document.createElement('li');
                            const adjectif_genre = ajouterEgenreM("Conjoint", person.genre)
                            conjointNameItem.textContent = `${adjectif_genre} : ${person.nom_conjoint} ${person.prenom_conjoint} `;
                            detailsList.appendChild(conjointNameItem); 
                           }
                 }
                                
                // Ajouter l'origine
                if (person.origine !== null) {
                    const origineItem = document.createElement('li');
                    origineItem.textContent = `Pays d'origine : ${person.origine}`;
                    detailsList.appendChild(origineItem);
                }

                // Ajouter l'affranchissement 
                if (person.affranchi !== null) {
                    const affranchissementItem = document.createElement('li');
                    affranchissementItem.textContent = `Affranchi en 1848`;
                    detailsList.appendChild(affranchissementItem);
                }                

                // Recherche des enfants
                const children = data.filter(child => {
                    return (child.nom_pere === person.nom && child.prenom_pere === person.prenom) || (child.nom_mere === person.nom && child.prenom_mere === person.prenom);
                     });
                if (children.length > 0) {
                    const childrenList = document.createElement('li');
                    const childrenHeader = document.createElement('h3');
                    childrenHeader.textContent = "Enfant(s) :";
                    childrenList.appendChild(childrenHeader);
                    const childrenUl = document.createElement('ul');
                    children.forEach(child => {
                        const childItem = document.createElement('li');
                        childItem.textContent = `${child.nom} ${child.prenom}`;
                        childrenUl.appendChild(childItem);
                    });
                    childrenList.appendChild(childrenUl);
                    detailsList.appendChild(childrenList);
                }
                
                personDetails.appendChild(detailsList);

            } else {
                personDetails.textContent = 'Personne introuvable.';
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

//Verifie si la date est connue  
function verifieDate(date) {
    const an = parseInt(date.substr(6, 4));
    const mois = parseInt(date.substr(3, 2));
    const day = parseInt(date.substr(0, 2));
    if (day === 01 && mois === 01) {
        if (an === 1901) {
            return "à une date inconnue" 
        }  else {
            return "dans le courant de l'année" + an
        }
    } else {
        return "le " + date
    }
}
