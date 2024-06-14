// CONSTANTES
const BASE_URL = "http://localhost:5678/api/"; 
const WORKS_API = BASE_URL + "works"; // Endpoint pour récupérer les travaux
const CATEGORY_API = BASE_URL + "categories"; // Endpoint pour récupérer les catégories
const GALLERY_DIV = document.querySelector(".gallery"); 
const FILTER_DIV = document.querySelector(".filter"); 

// Affiche les travaux dans la galerie
fetchWorks(GALLERY_DIV, false); // Récupère et affiche les travaux sans bouton de suppression

// Rafraîchit les travaux
function refreshWorks(targetDiv, deleteButton) {
    targetDiv.innerHTML = ''; 
    fetchWorks(targetDiv, deleteButton); 
}

// Récupération des travaux
function fetchWorks(targetDiv, deleteButton) {
    // Effectue une requête pour obtenir les travaux
    fetch(WORKS_API)
        .then(response => response.json()) 
        .then(works => { 
            workList = works; 
            for (let i = 0; i < works.length; i++) {
                createWork(works[i], targetDiv, deleteButton); 
            }
        });
}

// Affichage d'un travail
function createWork(work, targetDiv, deleteButton) {
    let figure = document.createElement("figure"); 
    let imgWorks = document.createElement("img"); 
    let figcaption = document.createElement("figcaption"); 
    imgWorks.src = work.imageUrl; 
    figcaption.innerHTML = work.title; 
    figure.appendChild(imgWorks); 
    figure.appendChild(figcaption); 
    targetDiv.appendChild(figure);
    if (deleteButton) { 
        createDeleteButton(figure, work); 
    }
}

// Récupération des catégories
fetch(CATEGORY_API)
    .then(response => response.json()) 
    .then(categories => {
        let filterWorks = new Set(categories); 
        let nouvelleCategorie = {id: 0, name: "Tous"}; 
        createFilterButton(nouvelleCategorie); 
        addSelectedClass(nouvelleCategorie.id); 
        for (let category of filterWorks) {
            createFilterButton(category); 
        }   
    });

// Création des boutons de filtre   
function createFilterButton(category) {
    let categoryLink = document.createElement("a"); 
    categoryLink.id = "category" + category.id; 
    categoryLink.classList.add("category"); 
    categoryLink.innerHTML = category.name; 
    FILTER_DIV.appendChild(categoryLink); 

    // Ajoute un écouteur d'événement au bouton de filtre
    categoryLink.addEventListener("click", function() {
        filterWorksByCategory(category.id); // Filtre les travaux par catégorie lors du clic
    });
}

// Filtre les travaux par catégorie
function filterWorksByCategory(categoryId) {
    // Vide le contenu de la galerie
    GALLERY_DIV.innerHTML = '';

    // Affiche uniquement les travaux correspondant à la catégorie sélectionnée
    for (let i = 0; i < workList.length; i++) {
        if (workList[i].categoryId === categoryId || categoryId === 0) {
            createWork(workList[i], GALLERY_DIV, false); 
        }  
    }

    // Gère l'apparence des filtres (sélection)
    removeSelectedClass(); 
    addSelectedClass(categoryId); 
}

// Modification de l'état du bouton login/logout si nécessaire
gestion_login(); // Vérifie l'état de connexion et met à jour l'interface

// Création d'un bouton de suppression pour chaque image
function createDeleteButton(figure, work) {
    let button = document.createElement('i'); 
    button.classList.add("fa-regular", "fa-trash-can"); 
    button.addEventListener('click', DELETE_WORK); 
    button.id = work.id; 
    figure.appendChild(button); 
}

// Ajoute la classe "selected" à une catégorie
function addSelectedClass(categoryId) {
    document.getElementById("category" + categoryId).classList.add("selected"); // Ajoute la classe "selected" à la catégorie
}

// Supprime la classe "selected" des catégories
function removeSelectedClass() {
    let filters = document.querySelectorAll(".category"); 
    for (let i = 0; i < filters.length; i++) {
        filters[i].classList.remove("selected"); 
    }
}

// Gestion de l'état de connexion
function gestion_login() {
    if (sessionStorage.getItem("token")) {
        // Change le texte du lien login en logout
        let loginLogoutLink = document.getElementById("login_logout");
        loginLogoutLink.textContent = "logout";
        
        // Affiche le bandeau d'édition
        let bandeau_edit = document.getElementById("edition");
        bandeau_edit.style.display = "flex";
        
        // Affiche l'option de modification des projets
        let projet_modif = document.getElementById("modif_projet");
        projet_modif.style.display = "inline";
        
        // Cache les filtres en mode édition
        let button_filter = document.querySelector(".filter");
        button_filter.style.display = "none";
        
        // Déconnexion lors du clic sur logout
        loginLogoutLink.addEventListener("click", function(event) {
            event.preventDefault();

            // Supprime le token du session storage
            sessionStorage.removeItem("token");

            // Redirige vers la page d'accueil
            window.location.href = "index.html";
        });
    }
}
