// CONSTANTES
const NEW_MODALE = document.querySelector(".modal-new-photo"); // Élément modal pour ajouter une nouvelle photo
const BUTTON_CLOSE_NEW = document.querySelector('.js-modal-close-new'); // Bouton pour fermer la modal
const BUTTON_BACK = document.querySelector('.modal-back'); // Bouton pour revenir à la modal précédente
const BUTTON_ADD = document.querySelector('.button-add-photo'); // Bouton pour déclencher l'ajout d'une photo
const INPUT_PICTURE = document.querySelector('#input-picture'); // Champ de saisie pour sélectionner une photo
const PICTURE_PREVIEW = document.querySelector('#picture-preview'); // Élément pour afficher l'aperçu de la photo
const PICTURE_SELECTION = document.querySelector('.picture-selection'); // Zone de sélection de la photo
const CATEGORIES_SELECT = document.querySelector('.select-category'); // Liste déroulante pour sélectionner une catégorie
const TITLE_NEW_PHOTO = document.querySelector('.input-titre'); // Champ de saisie pour le titre de la nouvelle photo
const BUTTON_SUBMIT = document.querySelector('.button-submit'); // Bouton pour soumettre le nouveau projet

let modal_new = null; // Variable pour stocker la référence de la modal

// FONCTION OUVERTURE BOITE MODALE
const OPEN_MODAL_NEW = function (e) {
    e.preventDefault(); // Empêche le comportement par défaut du lien
    // Cache la modal de la galerie
    modal.style.display = "none";
    // Affiche la modal de création
    modal_new = document.querySelector("#modal2");
    modal_new.style.display = null;
    modal_new.addEventListener('click', CLOSE_MODAL_NEW); // Ajoute un écouteur pour fermer la modal en cliquant à l'extérieur
    BUTTON_CLOSE_NEW.addEventListener('click', CLOSE_MODAL_NEW); // Ajoute un écouteur pour fermer la modal en cliquant sur le bouton
    let modal_wrapper = document.querySelector(".modal-wrapper-new");
    modal_wrapper.style.display = "flex"; // Affiche le wrapper de la modal
    resetPhotoSelection(); // Réinitialise la sélection de la photo
    resetForm(); // Réinitialise le formulaire d'ajout de photo
    loadCategories(); // Charge les catégories disponibles depuis l'API
}

// FONCTION FERMETURE BOITE MODALE
const CLOSE_MODAL_NEW = function (e) {
    if (modal_new == null) return; // Si la modal n'est pas ouverte, on ne fait rien
    // Si on clique à l'extérieur de la modal ou sur le bouton de fermeture, on ferme la modal
    if (e.target != modal_new && e.target != BUTTON_CLOSE_NEW && e.target != document.querySelector('.top .fa-x')) return;
    e.preventDefault(); // Empêche le comportement par défaut
    modal_new.style.display = "none"; // Cache la modal
    modal_new.removeEventListener('click', CLOSE_MODAL_NEW); // Retire l'écouteur pour fermer la modal en cliquant à l'extérieur
    BUTTON_CLOSE_NEW.removeEventListener('click', CLOSE_MODAL_NEW); // Retire l'écouteur pour fermer la modal en cliquant sur le bouton
}

// BOUTON RETOUR
BUTTON_BACK.addEventListener("click", function() {
    modal_new.style.display = "none"; // Cache la modal de création
    modal.style.display = "flex"; // Affiche la modal de la galerie
})

// BOUTON AJOUT PHOTO
BUTTON_ADD.addEventListener("click", function() {
    INPUT_PICTURE.click(); // Déclenche l'ouverture du sélecteur de fichier
})

// SELECTEUR FICHIER PHOTO
INPUT_PICTURE.addEventListener("change", function() {
    // Vérifie si le fichier sélectionné dépasse la taille maximale de 4 Mo
    if (this.files[0].size > 4194304) {
        alert("Fichier trop volumineux");
        this.value = ""; // Réinitialise le champ de sélection
    };
    // Si un fichier est sélectionné, affiche l'aperçu de la photo
    if (this.files[0]) {
        PICTURE_PREVIEW.src = URL.createObjectURL(this.files[0]); // Définit la source de l'aperçu de la photo
        PICTURE_PREVIEW.style.display = "block"; // Affiche l'élément d'aperçu
        PICTURE_SELECTION.style.display = "none"; // Cache la zone de sélection de la photo
    }
})

// REMISE A ZERO SELECTION IMAGE
function resetPhotoSelection() {
    INPUT_PICTURE.value = ""; // Réinitialise le champ de sélection de fichier
    PICTURE_PREVIEW.src = ""; // Réinitialise la source de l'aperçu de la photo
    PICTURE_PREVIEW.style.display = "none"; // Cache l'aperçu de la photo
    PICTURE_SELECTION.style.display = "block"; // Affiche la zone de sélection de la photo
}

// REMISE A ZERO FORMULAIRE UPLOAD
function resetForm() {
    CATEGORIES_SELECT.value = 0; // Réinitialise la sélection de catégorie
    TITLE_NEW_PHOTO.value = ""; // Réinitialise le champ de titre
}

// CHARGEMENT CATEGORIES DEPUIS API
function loadCategories() {
    CATEGORIES_SELECT.innerHTML = ''; // Vide la liste déroulante avant de la remplir
    let option = document.createElement("option");
    option.value = 0;
    option.text = "";
    CATEGORIES_SELECT.add(option); // Ajoute une option vide dans le formulaire
    // Effectue une requête pour obtenir les catégories depuis l'API
    fetch(CATEGORY_API)
    .then(response => response.json()) // Convertit la réponse en JSON
    .then(categories => {
        for (let category of categories) {
            let option = document.createElement("option");
            option.value = category.id; // Définit l'ID de la catégorie
            option.text = category.name; // Définit le nom de la catégorie
            CATEGORIES_SELECT.add(option); // Ajoute l'option à la liste déroulante
        }   
    })
}

// UPLOAD NOUVEAU PROJET
const UPLOAD_WORK = function() {
    let token = sessionStorage.getItem("token"); // Récupère le token de session

    const formData = new FormData();
    formData.append("image", INPUT_PICTURE.files[0]); // Ajoute le fichier image au formulaire
    formData.append("title", TITLE_NEW_PHOTO.value); // Ajoute le titre au formulaire
    formData.append("category", CATEGORIES_SELECT.value); // Ajoute la catégorie au formulaire
    
    fetch(WORKS_API, {
        method: "POST",
        headers: {
            'Accept': '*/*',
            'Authorization': `Bearer ${token}`,
        },
        body: formData // Envoie le formulaire
    })
    .then(response => {
        if (response.status === 200 || response.status === 201) {
            resetPhotoSelection(); // Réinitialise l'aperçu de la photo
            resetForm(); // Réinitialise le formulaire
            refreshWorks(GALLERY_MODALE, true); // Réaffiche les travaux dans la modal
            refreshWorks(GALLERY_DIV, false); // Réaffiche les travaux dans l'index
            VERIFICATION(); // Vérifie si le formulaire est complet
        } else if (response.status === 401) {
            alert('Session expirée ou invalide'); // Alerte si la session est expirée ou invalide
        } else {
            alert('Erreur technique inconnue'); // Alerte en cas d'erreur technique
        }
    })
}

// VERIFICATION FORMULAIRE COMPLET
const VERIFICATION = function (e) {
    // Vérifie si tous les champs du formulaire sont remplis
    if (INPUT_PICTURE.value != "" && CATEGORIES_SELECT.value != 0 && TITLE_NEW_PHOTO.value != "") {
        BUTTON_SUBMIT.style.backgroundColor = "#1D6154"; // Change la couleur du bouton de soumission
        BUTTON_SUBMIT.style.cursor = "pointer"; // Change le curseur du bouton de soumission
        BUTTON_SUBMIT.addEventListener("click", UPLOAD_WORK); // Ajoute l'événement de soumission au bouton
    } else {
        BUTTON_SUBMIT.style.backgroundColor = "#A7A7A7"; // Réinitialise la couleur du bouton de soumission
        BUTTON_SUBMIT.style.cursor = "default"; // Réinitialise le curseur du bouton de soumission
        BUTTON_SUBMIT.removeEventListener("click", UPLOAD_WORK); // Retire l'événement de soumission du bouton
    }
}

// Ajoute des écouteurs d'événements pour vérifier le formulaire lors des changements
INPUT_PICTURE.addEventListener("change", VERIFICATION);
CATEGORIES_SELECT.addEventListener("change", VERIFICATION);
TITLE_NEW_PHOTO.addEventListener("change", VERIFICATION);

// Ajoute des écouteurs d'événements pour ouvrir la modal de création de projet
document.querySelectorAll('#ajout_projet').forEach(a => {
    a.addEventListener('click', OPEN_MODAL_NEW);
});
