// CONSTANTES
const GALLERY_MODALE = document.querySelector(".modal-gallery"); // Élément de la galerie dans la modal
const BUTTON_CLOSE = document.querySelector('.js-modal-close-1'); // Bouton pour fermer la modal
const MODALE_WRAPPER = document.querySelector(".modal-wrapper"); // Wrapper de la modal
const BUTTON_MODIF_WORKS = document.querySelector('#modif_projet'); // Bouton pour modifier les travaux

let modal = null; // Variable pour stocker la référence de la modal

// FONCTION OUVERTURE BOITE MODALE
const OPEN_MODAL = function (e) {
    e.preventDefault(); // Empêche le comportement par défaut du lien
    modal = document.querySelector("#modal1"); // Récupère l'élément de la modal
    modal.style.display = null; // Affiche la modal
    modal.addEventListener('click', CLOSE_MODAL); // Ajoute un écouteur pour fermer la modal en cliquant à l'extérieur
    BUTTON_CLOSE.addEventListener('click', CLOSE_MODAL); // Ajoute un écouteur pour fermer la modal en cliquant sur le bouton
    MODALE_WRAPPER.style.display = "flex"; // Affiche le wrapper de la modal
    GALLERY_MODALE.innerHTML = ''; // Vide le contenu de la galerie dans la modal
    fetchWorks(GALLERY_MODALE, true); // Récupère et affiche les travaux dans la modal avec la possibilité de supprimer
}

// FONCTION FERMETURE BOITE MODALE
const CLOSE_MODAL = function (e) {
    if (modal == null) return; // Si la modal n'est pas ouverte, on ne fait rien
    // Si on clique à l'extérieur de la modal ou sur le bouton de fermeture, on ferme la modal
    if (e.target != modal && e.target != BUTTON_CLOSE && e.target != document.querySelector('.fa-solid')) return;
    e.preventDefault(); // Empêche le comportement par défaut
    modal.style.display = "none"; // Cache la modal
    modal.removeEventListener('click', CLOSE_MODAL); // Retire l'écouteur pour fermer la modal en cliquant à l'extérieur
    BUTTON_CLOSE.removeEventListener('click', CLOSE_MODAL); // Retire l'écouteur pour fermer la modal en cliquant sur le bouton
}

// AJOUT LISTENER SUR CLIQUE BOUTON MODIFIER POUR APPELER OUVERTURE MODALE  
BUTTON_MODIF_WORKS.addEventListener('click', OPEN_MODAL); // Ajoute un écouteur pour ouvrir la modal en cliquant sur le bouton modifier

// FONCTION SUPPRESSION TRAVAUX
const DELETE_WORK = function (e) {
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce projet ?"); // Demande de confirmation à l'utilisateur

    if (confirmation) {
        try {
            deleteWorkFetch(e.target.id); // Appel de la fonction pour supprimer le travail si l'utilisateur confirme
        } catch (error) {
            console.error("Erreur lors de la suppression du projet:", error); // Affiche une erreur en cas d'échec
        }
    }
}

// APPEL API SUPPRESSION TRAVAUX
function deleteWorkFetch(idWork) {
    let token = sessionStorage.getItem("token"); // Récupère le token de session

    fetch(WORKS_API + '/' + idWork, {
        method: "DELETE", // Méthode DELETE pour supprimer le travail
        headers: {
            'Accept': '*/*',
            'Authorization': `Bearer ${token}`, // Utilise le token pour l'autorisation
        }
    })
    .then(response => {
        if (response.status === 200 || response.status === 201 || response.status === 204) {
            refreshWorks(GALLERY_MODALE, true); // Réaffiche les travaux dans la modal après suppression
            refreshWorks(GALLERY_DIV, false); // Réaffiche les travaux dans l'index après suppression
        } else {
            alert("Erreur lors de la suppression du projet."); // Alerte en cas d'erreur lors de la suppression
        }
    })
}
