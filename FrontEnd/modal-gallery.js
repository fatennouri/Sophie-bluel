const galleryModale = document.querySelector(".modal-gallery"); 
const buttonClose = document.querySelector('.js-modal-close-1'); 
const modaleWrapper = document.querySelector(".modal-wrapper"); 
const buttonModifWorks = document.querySelector('#modif_projet'); 

let modal = null; 

const openModal = function (e) {
    e.preventDefault(); 
    modal = document.querySelector("#modal1"); 
    modal.style.display = null; 
    modal.addEventListener('click', closeModal); 
    buttonClose.addEventListener('click', closeModal); 
    modaleWrapper.style.display = "flex"; 
    galleryModale.innerHTML = ''; 
    fetchWorks(galleryModale, true); 
}

const closeModal = function (e) {
    if (modal == null) return; 
    if (e.target != modal && e.target != buttonClose && e.target != document.querySelector('.fa-solid')) return;
    e.preventDefault(); 
    modal.style.display = "none"; 
    modal.removeEventListener('click', closeModal); 
    buttonClose.removeEventListener('click', closeModal); 
}

buttonModifWorks.addEventListener('click', openModal); 

const deleteWork = function (e) {
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce projet ?"); 

    if (confirmation) {
        try {
            deleteWorkFetch(e.target.id); 
        } catch (error) {
            console.error("Erreur lors de la suppression du projet:", error); 
        }
    }
}

// Appel API suppression travaux
function deleteWorkFetch(idWork) {
    let token = localStorage.getItem("token");

    fetch(worksApi + '/' + idWork, {
        method: "DELETE", 
        headers: {
            'Accept': '*/*',
            'Authorization': `Bearer ${token}`, 
        }
    })
    .then(response => {
        if (response.status >= 200 && response.status < 300) {
            refreshWorks(galleryModale, true); 
            refreshWorks(galleryDiv, false); 
        } else {
            alert("Erreur lors de la suppression du projet."); 
        }
    })
    .catch(error => {
        console.error("Erreur lors de la requête fetch pour supprimer le projet:", error);
    });
    }
