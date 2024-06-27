const GALLERY_MODALE = document.querySelector(".modal-gallery"); 
const BUTTON_CLOSE = document.querySelector('.js-modal-close-1'); 
const MODALE_WRAPPER = document.querySelector(".modal-wrapper"); 
const BUTTON_MODIF_WORKS = document.querySelector('#modif_projet'); 

let modal = null; 

const openModal = function (e) {
    e.preventDefault(); 
    modal = document.querySelector("#modal1"); 
    modal.style.display = null; 
    modal.addEventListener('click', closeModal); 
    BUTTON_CLOSE.addEventListener('click', closeModal); 
    MODALE_WRAPPER.style.display = "flex"; 
    GALLERY_MODALE.innerHTML = ''; 
    fetchWorks(GALLERY_MODALE, true); 
}

const closeModal = function (e) {
    if (modal == null) return; 
        if (e.target != modal && e.target != BUTTON_CLOSE && e.target != document.querySelector('.fa-solid')) return;
    e.preventDefault(); // 
    modal.style.display = "none"; 
    modal.removeEventListener('click', closeModal); 
    BUTTON_CLOSE.removeEventListener('click', closeModal); }

BUTTON_MODIF_WORKS.addEventListener('click', openModal); 

const DELETE_WORK = function (e) {
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce projet ?"); 

    if (confirmation) {
        try {
            deleteWorkFetch(e.target.id); 
        } catch (error) {
            console.error("Erreur lors de la suppression du projet:", error); 
        }
    }
}
// APPEL API SUPPRESSION TRAVAUX
function deleteWorkFetch(idWork) {
    let token = localStorage.getItem("token");

    fetch(WORKS_API + '/' + idWork, {
        method: "DELETE", 
        headers: {
            'Accept': '*/*',
            'Authorization': `Bearer ${token}`, 
        }
    })
    .then(response => {
        if (response.status === 200 || response.status === 201 || response.status === 204) {
            refreshWorks(GALLERY_MODALE, true); 
            refreshWorks(GALLERY_DIV, false); 
        } else {
            alert("Erreur lors de la suppression du projet."); 
        }
    })
}
