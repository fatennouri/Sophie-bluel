const newModale = document.querySelector(".modal-new-photo"); 
const buttonCloseNew = document.querySelector('.js-modal-close-new'); 
const buttonBack = document.querySelector('.modal-back'); 
const buttonAdd = document.querySelector('.button-add-photo'); 
const inputPicture = document.querySelector('#input-picture'); 
const picturePreview = document.querySelector('#picture-preview'); 
const pictureSelection = document.querySelector('.picture-selection'); 
const categoriesSelect = document.querySelector('.select-category'); 
const titleNewPhoto = document.querySelector('.input-titre'); 
const buttonSubmit = document.querySelector('.button-submit'); 

let modalNew= null; 

// FONCTION OUVERTURE BOITE MODALE
const openModalNew= function (e) {
    e.preventDefault(); 
    modal.style.display = "none";
    modalNew= document.querySelector("#modal2");
    modalNew.style.display = null;
    modalNew.addEventListener('click', closeModalNew);
    buttonCloseNew.addEventListener('click', closeModalNew); 
    let modal_wrapper = document.querySelector(".modal-wrapper-new");
    modal_wrapper.style.display = "flex";
    resetPhotoSelection(); 
    resetForm(); 
    loadCategories(); 
}
// FONCTION FERMETURE BOITE MODALE
const closeModalNew= function (e) {
    if (modalNew== null) return; 
    if (e.target != modalNew&& e.target != buttonCloseNew && e.target != document.querySelector('.top .fa-x')) return;
    e.preventDefault(); 
    modalNew.style.display = "none"; 
    modalNew.removeEventListener('click', closeModalNew);
    buttonCloseNew.removeEventListener('click', closeModalNew); }

buttonBack.addEventListener("click", function() {
    modalNew.style.display = "none"; 
    modal.style.display = "flex"; 
})

buttonAdd.addEventListener("click", function() {
    inputPicture.click(); 
})

inputPicture.addEventListener("change", function() {
   
    if (this.files[0].size > 4194304) {
        alert("Fichier trop volumineux");
        this.value = "";
    };
    
    if (this.files[0]) {
        picturePreview.src = URL.createObjectURL(this.files[0]); 
        picturePreview.style.display = "block"; 
        pictureSelection.style.display = "none"; 
    }
})
function resetPhotoSelection() {
    inputPicture.value = ""; 
    picturePreview.src = ""; 
    picturePreview.style.display = "none"; 
    pictureSelection.style.display = "block";
}

function resetForm() {
    categoriesSelect.value = 0; 
    titleNewPhoto.value = ""; 
}
// CHARGEMENT CATEGORIES DEPUIS API
function loadCategories() {
    categoriesSelect.innerHTML = ''; 
    let option = document.createElement("option");
    option.value = 0;
    option.text = "";
    categoriesSelect.add(option); 
    fetch(categoryApi)
    .then(response => response.json()) 
    .then(categories => {
        for (let category of categories) {
            let option = document.createElement("option");
            option.value = category.id; 
            option.text = category.name; 
            categoriesSelect.add(option); 
        }   
    })
}
// UPLOAD NOUVEAU PROJET
const uploadWork = function() {
    let token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("image", inputPicture.files[0]); 
    formData.append("title", titleNewPhoto.value); 
    formData.append("category", categoriesSelect.value);
    fetch(worksApi, {
        method: "POST",
        headers: {
            'Accept': '*/*',
            'Authorization': `Bearer ${token}`,
        },
        body: formData 
    })
    .then(response => {
        if ( response.status === 201) {
            resetPhotoSelection();
            resetForm(); 
            refreshWorks(galleryModale, true); 
            refreshWorks(galleryDiv, false); 
            verification();
        } else if (response.status === 401) {
            alert('Session expirée ou invalide'); 
        } else {
            alert('Erreur technique inconnue');
        }
    })
    .catch(error => {
        console.error('Erreur lors de la requête fetch pour créer le projet:', error);
        alert('Erreur lors de la requête fetch pour créer le projet. Veuillez réessayer.');
    });
}
// verification FORMULAIRE COMPLET
const verification = function (e) {
   
    if (inputPicture.value != "" && categoriesSelect.value != 0 && titleNewPhoto.value != "") {
        buttonSubmit.style.backgroundColor = "#1D6154"; 
        buttonSubmit.style.cursor = "pointer"; 
        buttonSubmit.addEventListener("click", uploadWork); 
    } else {
        buttonSubmit.style.backgroundColor = "#A7A7A7"; 
        buttonSubmit.style.cursor = "default"; 
        buttonSubmit.removeEventListener("click", uploadWork); 
    }
}
inputPicture.addEventListener("change", verification);
categoriesSelect.addEventListener("change", verification);
titleNewPhoto.addEventListener("change", verification);

document.querySelectorAll('#ajout_projet').forEach(a => {
    a.addEventListener('click', openModalNew);
});
