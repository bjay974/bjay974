document.getElementById("person-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const person = {
        id: document.getElementById("id").value,
        nom: document.getElementById("nom").value,
        prenom: document.getElementById("prenom").value,
        genre: document.getElementById("genre").value,
        id_pere: document.getElementById("id_pere").value,
        id_mere: document.getElementById("id_mere").value,
        date_naissance: document.getElementById("date_naissance").value,
        lieu_naissance: document.getElementById("lieu_naissance").value,
        date_deces: document.getElementById("date_deces").value,
        lieu_deces: document.getElementById("lieu_deces").value,
        date_mariage: document.getElementById("date_mariage").value,
        lieu_mariage: document.getElementById("lieu_mariage").value,
        id_conjoint: document.getElementById("id_conjoint").value
    };

    // Charger les données existantes depuis data.json
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const existingPerson = data.find(p => p.id == person.id);
            if (existingPerson) {
                // Si la personne existe, on met à jour
                Object.assign(existingPerson, person);
                document.getElementById("message").innerHTML = "Données mises à jour avec succès.";
            } else {
                // Si la personne n'existe pas, on l'ajoute
                data.push(person);
                document.getElementById("message").innerHTML = "Nouvelle personne ajoutée avec succès.";
            }

            // Sauvegarder les données dans le fichier (simulé ici)
            saveData(data);
        })
        .catch(error => {
            console.error('Erreur:', error);
            document.getElementById("message").innerHTML = "Erreur lors de la manipulation des données.";
        });
});

// Fonction pour sauvegarder les données (simulée)
function saveData(data) {
    // Simuler la sauvegarde dans un fichier JSON
    console.log("Nouvelles données:", data);
    // Dans un environnement réel, il faudrait une API ou un backend pour sauvegarder les modifications
}
