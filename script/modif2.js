document.getElementById("load-person").addEventListener("click", function () {
    const id = document.getElementById("id").value;
    if (!id) {
        document.getElementById("message").innerText = "Ou la oubli mett le l'id.";
        return;
    }

    fetch('http://localhost:3000/api/data')
        .then(response => response.json())
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

                document.getElementById("message").innerHTML = "Lé bon, la charge le zafair.";
            } else {
                resetForm(); // Réinitialiser le formulaire pour saisir les informations
                document.getElementById("message").innerHTML = "Y faut saisi le moune.";
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


document.getElementById("save-btn").addEventListener("click", function () {
    const id = document.getElementById("id").value;
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

    fetch('http://localhost:3000/api/data')
        .then(response => response.json())
        .then(data => {
            const index = data.findIndex(p => p.id == id);
            if (index >= 0) {
                data[index] = newPerson;  // Mise à jour des données
            } else {
                data.push(newPerson);  // Ajout si la personne n'existe pas
            }

            return fetch('/api/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        })
        .then(response => response.json())
        .then(result => {
            document.getElementById("message").innerText = result.message;
            document.getElementById("message").innerText = "Lé bon .. la enrezit le moun.";
            resetForm() 
        })
        .catch(error => {
            console.error(error);
            document.getElementById("message").innerText = "Erreur lors de la sauvegarde des données.";
        });
});

function verificationDate(date) {
    const parts = date.split('/');
    // Reformatage de DD/MM/YYYY en YYYY-MM-DD
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

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