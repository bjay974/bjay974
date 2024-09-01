document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    const serviceID = 'service_s5iw748';  // Mon Service ID
    const templateID = 'template_74aqzqf'; // Mon Template ID
    const userID = 'rHp6xKxkYt_JZl33u'; // Mon User ID

    const templateParams = {
        nom: document.getElementById('nom').value,
        adresseMail: document.getElementById('adresseMail').value,
        sujet: document.getElementById('sujet').value,
        message: document.getElementById('message').value
    };

    fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                service_id: serviceID,
                template_id: templateID,
                user_id: userID,
                template_params: templateParams
            })
        })
        .then(response => {
            alert('Lé Valab. Merci pou out message');
            window.location.href = 'html/index.html'; // Redirige vers la page d'accueil après succès
        })
        .catch(error => {
            console.error('FAILED...');
            alert('L\'envoi du message a échoué, veuillez réessayer.');
    });

    document.getElementById('contact-form').reset();
});