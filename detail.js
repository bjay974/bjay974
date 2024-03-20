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

                // Ajouter la date de reonnaisance ainsi que le nom
                if (person.date_legitime !== null) {
                    const legDateItem = document.createElement('li');
                    const dateVerified = verifieDate(person.date_legitime) 
                    const adjectif_genre = ajouterE("Reconnu", person.genre)
                    legDateItem.innerHTML = `<em>${adjectif_genre} ${dateVerified} : <strong>${person.nom_legitime}</strong></em>`;
                    detailsList.appendChild(legDateItem);
                    detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                }

                // Ajouter la date de mariage et le nom si la date n'est pas nulle
                if (person.date_mariage !== null) {
                    const weddingDateItem = document.createElement('li');
                    const ageMariage = diffAge(person.date_mariage, person.date_naissance);
                    const adjectif_genre = ajouterE("Marié", person.genre)
                    weddingDateItem.textContent = `${adjectif_genre} le ${person.date_mariage} à l'âge de ${ageMariage} ans à de ${person.lieu_mariage}`;
                    detailsList.appendChild(weddingDateItem);  
                    const weddingCoItem = document.createElement('li');
                    const conjoint = data.find(p => p.id === person.id_conjoint);
                        if (conjoint) {
                            const conjointItem = document.createElement('li');
                            conjointItem.textContent = ` à : ${conjoint.nom} ${conjoint.prenom}`;
                            detailsList.appendChild(conjointItem);     
                        }
                    detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                }
                
                 // Ajouter la date de décès si elle n'est pas nulle
                if (person.date_deces !== null) {
                    const deathDateItem = document.createElement('li');
                    const ageDeces = diffAge(person.date_deces, person.date_naissance);
                    const dateVerified = verifieDate(person.date_deces) 
                    const adjectif_genre = ajouterE("Décédé", person.genre)
                    deathDateItem.textContent = `${adjectif_genre} ${dateVerified} à l'âge de ${ageDeces} ans à ${person.lieu_deces}`;
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
                
                // Charger le ou la conjoint
                if (person.date_mariage === null) {
                    if (person.id_conjoint) {
                        const conjoint = data.find(p => p.id === person.id_conjoint);
                        if (conjoint) {
                            const conjointItem = document.createElement('li');
                            const adjectif_genre = ajouterEgenreM("Conjoint", person.genre);
                            conjointItem.innerHTML = `<strong>${adjectif_genre}</strong> : ${conjoint.nom} ${conjoint.prenom}`;
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
                        fatherItem.innerHTML = `<strong><em>${adjectif_genre} de</em></strong> ${father.nom} ${father.prenom}`;
                        detailsList.appendChild(fatherItem);
                    } 
                } else {
                    const fatherItem = document.createElement('li');
                    fatherItem.innerHTML = "<strong><em>Père</em></strong> inconnu";
                    detailsList.appendChild(fatherItem);
                }
                
              // Charger la mère si l'ID de la mère est défini
                if (person.id_mere) {
                    const mother = data.find(p => p.id === person.id_mere);
                    if (mother) {
                        const motherItem = document.createElement('li');
                        const adjectif_genre = ajouterParent(person.genre)
                        motherItem.innerHTML = `<strong><em>et de </em></strong> ${mother.nom} ${mother.prenom}`;
                        detailsList.appendChild(motherItem);
                        detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                    }
                } else {
                    const motherItem = document.createElement('li');
                    motherItem.innerHTML = "<strong><em>Mère</em></strong> inconnue";
                    detailsList.appendChild(motherItem);
                    detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                }   
                
                // Ajouter l'origine
                if (person.origine) {
                    const origineItem = document.createElement('li');
                    origineItem.textContent = `Pays d'origine : ${person.origine}`;
                    detailsList.appendChild(origineItem);
                    detailsList.appendChild(document.createElement('br')); // Ajout d'un espace
                }
           
                // Récupérer les enfants de la personne si elle est définie comme père ou mère
                const childrenOfPerson = data.filter(child => child.id_pere === person.id || child.id_mere === person.id);
                if (childrenOfPerson.length > 0) {
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
                
                // Vérifier si l'acte d'affranchissemment existe pour la personne
                if (person.affranchi === true) {
                    const acteAffranItem = document.createElement('li');
                    const idPerson = person.id;
                    // Vérifier si le fichier PDF existe
                    const pdfFileName = `${idPerson}.pdf`;
                    // Vérifier si le fichier JPEG existe, sinon vérifier le fichier PDF
                    fetch(`affranchissement/${pdfFileName}`)
                        .then(response => {
                            if (response.ok) {
                                const pdfFilePath = `affranchissement/${pdfFileName}`;
                                const pdfLink = document.createElement('a');
                                pdfLink.textContent = `Voir l'acte d'affranchissement' (PDF)`;
                                pdfLink.href = pdfFilePath;
                                pdfLink.target = '_blank';
                                acteAffranItem.appendChild(pdfLink);
                                detailsList.appendChild(acteAffranItem);
                                detailsList.appendChild(document.createElement('br'));
                            } else {
                                const jpegFileName = `${idPerson}.jpg`;
                                const jpegFilePath = `affranchissement/${jpegFileName}`;
                                const jpegLink = document.createElement('a');
                                jpegLink.textContent = `Voir l'acte d'affranchissement (JPEG)`;
                                jpegLink.href = jpegFilePath;
                                jpegLink.target = '_blank';
                                acteAffranItem.appendChild(jpegLink);
                                detailsList.appendChild(acteAffranItem);
                                detailsList.appendChild(document.createElement('br'));
                            }
                 })
                }
                // Vérifier si l'acte de naissance existe pour la personne
                if (person.acte_nai === true) {
                    const acteNaissanceItem = document.createElement('li');
                    const idPerson = person.id;
                    // Vérifier si le fichier PDF existe
                    const pdfFileName = `${idPerson}.pdf`;
                    // Vérifier si le fichier JPEG existe, sinon vérifier le fichier PDF
                    fetch(`naissance/${pdfFileName}`)
                        .then(response => {
                            if (response.ok) {
                                const pdfFilePath = `naissance/${pdfFileName}`;
                                const pdfLink = document.createElement('a');
                                pdfLink.textContent = `Voir l'acte de naissance (PDF)`;
                                pdfLink.href = pdfFilePath;
                                pdfLink.target = '_blank';
                                acteNaissanceItem.appendChild(pdfLink);
                                detailsList.appendChild(acteNaissanceItem);
                                detailsList.appendChild(document.createElement('br'));
                            } else {
                                const jpegFileName = `${idPerson}.jpg`;
                                const jpegFilePath = `naissance/${jpegFileName}`;
                                const jpegLink = document.createElement('a');
                                jpegLink.textContent = `Voir l'acte de naissance (JPEG)`;
                                jpegLink.href = jpegFilePath;
                                jpegLink.target = '_blank';
                                acteNaissanceItem.appendChild(jpegLink);
                                detailsList.appendChild(acteNaissanceItem);
                                detailsList.appendChild(document.createElement('br'));
                            }
                 })
                }
                
                // Vérifier si l'acte de naissance existe pour la personne
                if (person.acte_mar === true) {
                    const acteMariageItem = document.createElement('li');
                    const idPerson = person.id;
                    // Vérifier si le fichier PDF existe
                    const pdfFileName = `${idPerson}.pdf`;
                    // Vérifier si le fichier JPEG existe, sinon vérifier le fichier PDF
                    fetch(`mariage/${pdfFileName}`)
                        .then(response => {
                            if (response.ok) {
                                const pdfFilePath = `mariage/${pdfFileName}`;
                                const pdfLink = document.createElement('a');
                                pdfLink.textContent = `Voir l'acte de mariage (PDF)`;
                                pdfLink.href = pdfFilePath;
                                pdfLink.target = '_blank';
                                acteMariageItem.appendChild(pdfLink);
                                detailsList.appendChild(acteMariageItem);
                                detailsList.appendChild(document.createElement('br'));
                            } else {
                                const jpegFileName = `${idPerson}.jpg`;
                                const jpegFilePath = `mariage/${jpegFileName}`;
                                const jpegLink = document.createElement('a');
                                jpegLink.textContent = `Voir l'acte de mariage (JPEG)`;
                                jpegLink.href = jpegFilePath;
                                jpegLink.target = '_blank';
                                acteMariageItem.appendChild(jpegLink);
                                detailsList.appendChild(acteMariageItem);
                                detailsList.appendChild(document.createElement('br'));
                            }
                 })
                }
                // Vérifier si l'acte de déces existe pour la personne
                if (person.acte_dec === true) {
                    const acteDecesItem = document.createElement('li');
                    const idPerson = person.id;
                    // Vérifier si le fichier PDF existe
                    const pdfFileName = `${idPerson}.pdf`;
                    // Vérifier si le fichier JPEG existe, sinon vérifier le fichier PDF
                    fetch(`deces/${pdfFileName}`)
                        .then(response => {
                            if (response.ok) {
                                const pdfFilePath = `deces/${pdfFileName}`;
                                const pdfLink = document.createElement('a');
                                pdfLink.textContent = `Voir l'acte de décés (PDF)`;
                                pdfLink.href = pdfFilePath;
                                pdfLink.target = '_blank';
                                acteDecesItem.appendChild(pdfLink);
                                detailsList.appendChild(acteDecesItem);
                                detailsList.appendChild(document.createElement('br'));
                            } else {
                                const jpegFileName = `${idPerson}.jpg`;
                                const jpegFilePath = `deces/${jpegFileName}`;
                                const jpegLink = document.createElement('a');
                                jpegLink.textContent = `Voir l'acte de décés (JPEG)`;
                                jpegLink.href = jpegFilePath;
                                jpegLink.target = '_blank';
                                acteDecesItem.appendChild(jpegLink);
                                detailsList.appendChild(acteDecesItem);
                                detailsList.appendChild(document.createElement('br'));
                            }
                 })
                }
                
                // Vérifier si un acte divers (militaire, naturalisation) existe pour la personne
                if (person.acte_div === true) {
                    const acteDiversItem = document.createElement('li');
                    const idPerson = person.id;
                    // Vérifier si le fichier PDF existe
                    const pdfFileName = `${idPerson}.pdf`;
                    // Vérifier si le fichier JPEG existe, sinon vérifier le fichier PDF
                    fetch(`divers/${pdfFileName}`)
                        .then(response => {
                            if (response.ok) {
                                const pdfFilePath = `divers/${pdfFileName}`;
                                const pdfLink = document.createElement('a');
                                pdfLink.textContent = `Voir l'acte (PDF)`;
                                pdfLink.href = pdfFilePath;
                                pdfLink.target = '_blank';
                                acteDiversItem.appendChild(pdfLink);
                                detailsList.appendChild(acteDiversItem);
                                detailsList.appendChild(document.createElement('br'));
                            } else {
                                const jpegFileName = `${idPerson}.jpg`;
                                const jpegFilePath = `divers/${jpegFileName}`;
                                const jpegLink = document.createElement('a');
                                jpegLink.textContent = `Voir l'acte (JPEG)`;
                                jpegLink.href = jpegFilePath;
                                jpegLink.target = '_blank';
                                acteDiversItem.appendChild(jpegLink);
                                detailsList.appendChild(acteDiversItem);
                                detailsList.appendChild(document.createElement('br'));
                            }
                 })
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
