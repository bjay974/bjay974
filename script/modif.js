document.getElementById("person-form").addEventListener("submit", function (e) {
    e.preventDefault();

    // Charger les données existantes depuis data.json
    fetch('..data/data.json')
        .then(response => response.json())
        .then(data => {
            const person = data.find(p => p.id == id);
            if (person) {
                // Si la personne existe, préremplir le formulaire avec ses informations
                document.getElementById("nom").value = person.nom || "";
                document.getElementById("prenom").value = person.prenom || "";
                document.getElementById("genre").value = person.genre || "";
                document.getElementById("id_pere").value = person.id_pere || "";
                document.getElementById("id_mere").value = person.id_mere || "";
                document.getElementById("date_naissance").value = person.date_naissance || "";
                document.getElementById("lieu_naissance").value = person.lieu_naissance || "";
                document.getElementById("date_deces").value = person.date_deces || "";
                document.getElementById("lieu_deces").value = person.lieu_deces || "";
                document.getElementById("date_mariage").value = person.date_mariage || "";
                document.getElementById("lieu_mariage").value = person.lieu_mariage || "";
                document.getElementById("id_conjoint").value = person.id_conjoint || "";

                document.getElementById("message").innerHTML = "Données chargées avec succès.";
            } else {
                // Si la personne n'existe pas, réinitialiser le formulaire
                alert("Aucune personne trouvée avec cet ID.");
                resetForm();
            }
        // Extraire tous les lieux existants (naissance, décès, mariage)
        data.forEach(person => {
            if (person.lieu_naissance) lieux.add(person.lieu_naissance);
            if (person.lieu_deces) lieux.add(person.lieu_deces);
            if (person.lieu_mariage) lieux.add(person.lieu_mariage);
        });

        // Insérer les lieux dans la datalist pour l'autocomplétion
        const datalist = document.getElementById('lieux-list');
        lieux.forEach(lieu => {
            const option = document.createElement('option');
            option.value = lieu;
            datalist.appendChild(option);
        });
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
