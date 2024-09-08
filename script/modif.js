document.getElementById("person-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Empêcher le comportement par défaut du formulaire

    const id = document.getElementById("id").value; // Récupérer l'ID saisi

    // Charger les données existantes depuis data.json
    fetch('../data/data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors du chargement du fichier JSON');
            }
            return response.json();
        })
        .then(data => {
            // Chercher la personne avec l'ID saisi
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

                document.getElementById("message").innerHTML = "Données existantes chargées avec succès.";
            } else {
                // Si l'ID n'existe pas, permettre à l'utilisateur de créer une nouvelle personne
                resetForm(); // Réinitialiser le formulaire pour saisir les informations
                document.getElementById("message").innerHTML = "ID non trouvé. Saisissez les informations pour créer une nouvelle personne.";
            }

            // Extraire tous les lieux existants (naissance, décès, mariage)
            const lieux = new Set(); // Créer un Set pour les lieux
            data.forEach(person => {
                if (person.lieu_naissance) lieux.add(person.lieu_naissance);
                if (person.lieu_deces) lieux.add(person.lieu_deces);
                if (person.lieu_mariage) lieux.add(person.lieu_mariage);
            });

            // Insérer les lieux dans la datalist pour l'autocomplétion
            const datalist = document.getElementById('lieux-list');
            datalist.innerHTML = ''; // Vider la datalist avant d'ajouter les nouveaux lieux
            lieux.forEach(lieu => {
                const option = document.createElement('option');
                option.value = lieu;
                datalist.appendChild(option);
            });

            // Sauvegarder les données (ajout ou modification)
            document.getElementById("save-btn").addEventListener("click", function () {
                savePerson(data, id); // Appeler la fonction pour sauvegarder ou ajouter la personne
            });
        })
        .catch(error => {
            console.error('Erreur:', error);
            document.getElementById("message").innerHTML = "Erreur lors de la manipulation des données.";
        });
});

// Fonction pour réinitialiser le formulaire
function resetForm() {
    document.getElementById("nom").value = "";
    document.getElementById("prenom").value = "";
    document.getElementById("genre").value = "";
    document.getElementById("id_pere").value = "";
    document.getElementById("id_mere").value = "";
    document.getElementById("date_naissance").value = "";
    document.getElementById("lieu_naissance").value = "";
    document.getElementById("date_deces").value = "";
    document.getElementById("lieu_deces").value = "";
    document.getElementById("date_mariage").value = "";
    document.getElementById("lieu_mariage").value = "";
    document.getElementById("id_conjoint").value = "";
}

// Fonction pour sauvegarder les données ou ajouter une nouvelle personne
function savePerson(data, id) {
    const newPerson = {
        id: id,
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

    // Vérifier si la personne existe déjà dans les données
    const existingPersonIndex = data.findIndex(p => p.id == id);
    if (existingPersonIndex >= 0) {
        // Si elle existe, on la met à jour
        data[existingPersonIndex] = newPerson;
        document.getElementById("message").innerHTML = "Les données ont été mises à jour avec succès.";
    } else {
        // Si elle n'existe pas, on l'ajoute à la base
        data.push(newPerson);
        document.getElementById("message").innerHTML = "Nouvelle personne ajoutée avec succès.";
    }

    // Simuler la sauvegarde des données dans le fichier (dans un environnement réel, il faut une API ou backend)
    saveData(data);
}

// Fonction pour simuler la sauvegarde des données
function saveData(data) {
    console.log("Données mises à jour :", data);
    // Dans un environnement réel, il faudrait une API ou un backend pour sauvegarder les modifications
}
