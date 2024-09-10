document.getElementById("load-person").addEventListener("click", function () {
    const id = document.getElementById("id").value; // Récupérer l'ID saisi
    if (!id) {
        document.getElementById("message").innerHTML = "Ou la oubli mett le l'id.";
        throw new Error('Absence ID');
    }    
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
                let dateNaissance = person.date_naissance ? verificationDate(person.date_naissance) : null;
                let dateMariage = person.date_mariage ? verificationDate(person.date_mariage) : null;
                let dateDeces = person.date_deces ? verificationDate(person.date_deces) : null;
                document.getElementById("nom").value = person.nom || "";
                document.getElementById("prenom").value = person.prenom || "";
                document.getElementById("genre").value = person.genre || "";
                document.getElementById("id_pere").value = person.id_pere || "";
                document.getElementById("id_mere").value = person.id_mere || "";
                document.getElementById("date_naissance").value = dateNaissance || "";
                document.getElementById("lieu_naissance").value = person.lieu_naissance || "";
                document.getElementById("date_deces").value = dateDeces || "";
                document.getElementById("lieu_deces").value = person.lieu_deces || "";
                document.getElementById("date_mariage").value = dateMariage || "";
                document.getElementById("lieu_mariage").value = person.lieu_mariage || "";
                document.getElementById("id_conjoint").value = person.id_conjoint || "";

                document.getElementById("message").innerHTML = "Données existantes chargées avec succès.";
            } else {
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
    document.getElementById("commentaire").value = "";

}

// Ajouter une fonction pour sauvegarder les modifications
document.getElementById("reset-person").addEventListener("click", function () {
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
    document.getElementById("commentaire").value = "";
    document.getElementById("message").innerHTML = "Le zaffair lé prop.";
});


// Ajouter une fonction pour sauvegarder les modifications
document.getElementById("save-btn").addEventListener("click", function () {
    const id = document.getElementById("id").value;

    // Charger les données existantes pour mettre à jour
    fetch('../data/data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors du chargement du fichier JSON');
            }
            return response.json();
        })
        .then(data => {
            savePerson(data, id); // Appeler la fonction pour sauvegarder ou ajouter la personne
        })
        .catch(error => {
            console.error('Erreur:', error);
            document.getElementById("message").innerHTML = "Erreur lors de la manipulation des données.";
        });
});

function verificationDate(date) {
    const parts = date.split('/');
    // Reformatage de DD/MM/YYYY en YYYY-MM-DD
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
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

function toBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

// Fonction pour sauvegarder les données (GitHub API)
async function saveData(data) {
    const repoOwner = 'bjay974'; // Remplacez par votre nom d'utilisateur GitHub
    const repoName = 'bjay974'; // Remplacez par le nom de votre dépôt
    const branch = 'main'; // Branche sur laquelle vous souhaitez effectuer les modifications
    const filePath = 'data/data.json'; // Chemin vers le fichier JSON
    const token = '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'; // Remplacez par votre token GitHub
    const message = 'Updated JSON via web page'; // Message de commit

    // Récupérer le sha du fichier actuel (requis pour faire un commit via l'API)
    const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });

    const fileData = await response.json();
    const sha = fileData.sha; // Récupérer le SHA actuel du fichier

    // Encoder les nouvelles données en base64
    const newContent = JSON.stringify(data, null, 2); // Formater avec des retours à la ligne pour plus de lisibilité
    const contentBase64 = toBase64(newContent);

    // Faire une requête PUT pour mettre à jour le fichier
    const updateResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: message,
            content: contentBase64,
            sha: sha,
            branch: branch
        })
    });

    if (updateResponse.ok) {
        alert('Fichier JSON mis à jour avec succès !');
    } else {
        alert('Erreur lors de la mise à jour du fichier JSON.');
    }
}
