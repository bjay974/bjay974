document.addEventListener('DOMContentLoaded', () => {
    const personDetails = document.getElementById('person-details');

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
                const nameItem = document.createElement('li');
                const boldText = document.createElement('span');
                boldText.textContent = `${person.nom}, ${person.prenom}`;
                boldText.style.fontWeight = 'bold'; // Application du style gras
                nameItem.appendChild(boldText);
                detailsList.appendChild(nameItem);

                // Ajouter la date de naissance
                const birthDateItem = document.createElement('li');
                birthDateItem.textContent = `Naissance: ${person.date_naissance} à ${person.lieu_naissance} `;
                detailsList.appendChild(birthDateItem);

                // Ajouter la date de décès si elle n'est pas nulle
                if (person.date_deces !== null) {
                    const deathDateItem = document.createElement('li');
                    const ageDeces = calculateAge(person.date_deces, person.date_naissance);
                    deathDateItem.textContent = `Décès: ${person.date_deces} à ${person.lieu_deces} à ${ageDeces} ans `;
                    detailsList.appendChild(deathDateItem);}
                else {
                    const ageNowItem = document.createElement('li');
                    const ageNow = twCalculeAge(person.date_naissance);
                    ageNowItem.textContent = `Âge : ${ageNow} ans `;
                    detailsList.appendChild(ageNowItem);                    
                 }

                // Ajouter la date de mariage et le nom si la date n'est pas nulle
                if (person.date_mariage !== null) {
                    const weddingDateItem = document.createElement('li');
                    const ageMariage = calculateAge(person.date_mariage, person.date_naissance);
                    weddingDateItem.textContent = `Mariage: ${person.date_mariage} à ${person.lieu_mariage} à ${person.ageMariage}  `;
                    detailsList.appendChild(weddingDateItem);
                    if (person.nom_epouse !== null) {
                        const weddingNameItem = document.createElement('li');
                        weddingNameItem.textContent = `Nom d'épouse : ${person.nom_epouse}`;
                        detailsList.appendChild(weddingNameItem); 
                        }
                }

                // Ajouter le nom du conjoint 
                if (person.nom_conjoint !== null) {
                    if (person.date_mariage !== null) {
                        if (person.genre == "F") {
                            const epouxHeader = document.createElement('h3');
                            epouxHeader.textContent = "Epoux :";
                            const epouxNameItem = document.createElement('li');
                            epouxNameItem.textContent = `${person.nom_epouse}, ${person.prenom_conjoint} `;
                            detailsList.appendChild(epouxNameItem); 
                            }
                        else {
                            const epouseHeader = document.createElement('h3');
                            epouxHeader.textContent = "Epouse :";
                            const epouseNameItem = document.createElement('li');
                            epouseNameItem.textContent = `: ${person.nom_conjoint}, ${person.prenom_conjoint} `;
                            detailsList.appendChild(epouseNameItem); }
                        }
                    else {
                            const conjointHeader = document.createElement('h3');
                            conjointHeader.textContent = "Epoux :";    
                            const conjointNameItem = document.createElement('li');
                            conjointNameItem.textContent = `Conjoint : ${person.nom_conjoint}, ${person.prenom_conjoint} `;
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
                    childrenHeader.textContent = "Enfants :";
                    childrenList.appendChild(childrenHeader);
                    const childrenUl = document.createElement('ul');
                    children.forEach(child => {
                        const childItem = document.createElement('li');
                        childItem.textContent = `${child.nom}, ${child.prenom}`;
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

function calculateAge(date1, date2) {
    let annee1 = new Date(date1).getUTCFullYear();
    let annee2 = new Date(date2).getUTCFullYear();
    return annee1 - annee2;
}

// Obtenir l’âge
function twCalculeAge(date1) {
    let annee1 = new Date().getUTCFullYear();
    let annee2 = new Date(date1).getUTCFullYear();
    return annee1 - annee2;
}
