// ========================================
// 1. INITIALISATION EMAILJS
// ========================================

emailjs.init("xhzYZTyMQ8OHZf4x1");


// ========================================
// 2. RECUPERATION DES ELEMENTS HTML
// ========================================

const formulaire = document.getElementById("Formulaire");

const nom = document.getElementById("nom");
const prenom = document.getElementById("prenom");
const filiere = document.getElementById("filiere");
const email = document.getElementById("email");
const numero = document.getElementById("numero");

const boutonValid = document.getElementById("boutton-valid");
const message = document.getElementById("message");


// ========================================
// 3. VERIFICATION DES EMAILS DEJA UTILISES
// ========================================

function emailDejaInscrit(adresseEmail) {

    let emails = JSON.parse(
        localStorage.getItem("emails_recap_bac") || "[]"
    );

    return emails.includes(adresseEmail.toLowerCase().trim());

}


// ========================================
// 4. ENREGISTREMENT DE L'EMAIL
// ========================================

function enregistrerEmail(adresseEmail) {

    let emails = JSON.parse(
        localStorage.getItem("emails_recap_bac") || "[]"
    );

    emails.push(adresseEmail.toLowerCase().trim());

    localStorage.setItem(
        "emails_recap_bac",
        JSON.stringify(emails)
    );

}


// ========================================
// 5. GENERATION DU CODE UNIQUE
// ========================================

function genererCodeUnique() {

    let dernierNumero = Number(
        localStorage.getItem("dernier_numero_recap") || 0
    );

    let nouveauNumero = dernierNumero + 1;

    localStorage.setItem(
        "dernier_numero_recap",
        nouveauNumero
    );

    return `RB26-${String(nouveauNumero).padStart(3, "0")}`;

}


// ========================================
// 6. GENERATION DU QR CODE
// ========================================

function genererQRCode(codeUnique) {

    const url = "https://api.qrserver.com/v1/create-qr-code/";

    return `${url}?size=300x300&data=${encodeURIComponent(codeUnique)}`;

}


// ========================================
// 7. AFFICHAGE DES MESSAGES
// ========================================

function afficherMessage(texte, type) {

    message.textContent = texte;

    message.className = `message ${type}`;

}


// ========================================
// 8. SOUMISSION DU FORMULAIRE
// ========================================

formulaire.addEventListener("submit", async function(event) {

    event.preventDefault();

    // Vérification des champs
    if (!formulaire.checkValidity()) {

        formulaire.reportValidity();

        return;

    }

    // Récupération des informations
    const nom1 = nom.value.trim();

    const prenom1 = prenom.value.trim();

    const filiere1 = filiere.value;

    const email1 = email.value.trim().toLowerCase();

    const numero1 = numero.value.trim();


    // Vérification de l'adresse email
    if (emailDejaInscrit(email1)) {

        afficherMessage(
            "Cette adresse e-mail a déjà été utilisée pour une inscription. Consulte ta boîte mail pour retrouver ton QR Code.",
            "error"
        );

        return;

    }


    // Désactivation du bouton
    boutonValid.disabled = true;

    boutonValid.innerHTML = `
        <span>ENVOI EN COURS...</span>
        <i class="bi bi-arrow-repeat"></i>
    `;


    afficherMessage(
        "Préparation de votre inscription...",
        "success"
    );


    try {

        // Génération de l'identifiant
        const codeUnique = genererCodeUnique();


        // Génération du QR Code
        const qrCode = genererQRCode(codeUnique);


        // Préparation des données EmailJS
        const informations = {

            nom: nom1,

            prenom: prenom1,

            filiere: filiere1,

            email: email1,

            numero: numero1,

            code_unique: codeUnique,

            qr_code: qrCode

        };


        // Envoi du mail
        await emailjs.send(
            "service_2t4axia",
            "template_h64a38s",
            informations
        );


        // Enregistrement de l'adresse après succès
        enregistrerEmail(email1);


        // Message de confirmation
        afficherMessage(
            `Félicitations ${prenom1} ! Ton inscription est confirmée. Ton code personnel est ${codeUnique}. Consulte ta boîte mail.`,
            "success"
        );


        // Réinitialisation du formulaire
        formulaire.reset();


    }catch (erreur) {

    console.error("Erreur complète :", erreur);

    afficherMessage(
        `Échec de l'envoi : ${erreur.text || erreur.message || "Erreur inconnue"}`,
        "error"
    );

}

    finally {

        // Réactivation du bouton
        boutonValid.disabled = false;

        boutonValid.innerHTML = `
            <span>VALIDER MON INSCRIPTION</span>
            <i class="bi bi-arrow-right-circle-fill"></i>
        `;

    }

});