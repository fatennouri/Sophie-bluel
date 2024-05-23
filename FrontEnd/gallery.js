// CONSTANTES
const BASE_URL = "http://localhost:5678/api/"; // URL de base pour les requêtes API
const WORKS_API = BASE_URL + "works"; // Endpoint pour récupérer les travaux
const CATEGORY_API = BASE_URL + "categories"; // Endpoint pour récupérer les catégories
const GALLERY_DIV = document.querySelector(".gallery"); // Élément de la galerie d'images
const FILTER_DIV = document.querySelector(".filter"); // Élément des filtres

// Affiche les travaux dans la galerie
fetchWorks(GALLERY_DIV, false); // Récupère et affiche les travaux sans bouton de suppression

// Rafraîchit les travaux
function refreshWorks(targetDiv, deleteButton) {
    targetDiv.innerHTML = ''; // Vide le contenu de la div cible
    fetchWorks(targetDiv, deleteButton); // Récupère et affiche les travaux
}

// Récupération des travaux
function fetchWorks(targetDiv, deleteButton) {
    // Effectue une requête pour obtenir les travaux
    fetch(WORKS_API)
        .then(response => response.json()) // Convertit la réponse en JSON
        .then(works => { 
            workList = works; // Stocke les travaux pour les réutiliser dans les filtres
            for (let i = 0; i < works.length; i++) {
                createWork(works[i], targetDiv, deleteButton); // Crée et affiche chaque travail
            }
        });
}

// Affichage d'un travail
function createWork(work, targetDiv, deleteButton) {
    let figure = document.createElement("figure"); // Crée un élément figure
    let imgWorks = document.createElement("img"); // Crée un élément img
    let figcaption = document.createElement("figcaption"); // Crée un élément figcaption
    imgWorks.src = work.imageUrl; // Définit la source de l'image
    figcaption.innerHTML = work.title; // Définit le titre de l'image
    figure.appendChild(imgWorks); // Ajoute l'image à la figure
    figure.appendChild(figcaption); // Ajoute le titre à la figure
    targetDiv.appendChild(figure); // Ajoute la figure à la div cible
    if (deleteButton) { // Si un bouton de suppression est demandé
        createDeleteButton(figure, work); // Crée et ajoute le bouton de suppression
    }
}

// Récupération des catégories
fetch(CATEGORY_API)
    .then(response => response.json()) // Convertit la réponse en JSON
    .then(categories => {
        let filterWorks = new Set(categories); // Crée un ensemble de catégories uniques
        let nouvelleCategorie = {id: 0, name: "Tous"}; // Crée une catégorie "Tous"
        createFilterButton(nouvelleCategorie); // Crée le bouton de filtre "Tous"
        addSelectedClass(nouvelleCategorie.id); // Sélectionne par défaut la catégorie "Tous"
        for (let category of filterWorks) {
            createFilterButton(category); // Crée un bouton de filtre pour chaque catégorie
        }   
    });

// Création des boutons de filtre   
function createFilterButton(category) {
    let categoryLink = document.createElement("a"); // Crée un élément lien
    categoryLink.id = "category" + category.id; // Définit l'ID du lien
    categoryLink.classList.add("category"); // Ajoute la classe "category" au lien
    categoryLink.innerHTML = category.name; // Définit le nom de la catégorie comme contenu du lien
    FILTER_DIV.appendChild(categoryLink); // Ajoute le lien à la div de filtre

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
            createWork(workList[i], GALLERY_DIV, false); // Affiche le travail dans la galerie
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
    let button = document.createElement('i'); // Crée un élément icône
    button.classList.add("fa-regular", "fa-trash-can"); // Ajoute les classes pour l'icône de poubelle
    button.addEventListener('click', DELETE_WORK); // Ajoute un écouteur d'événement pour la suppression
    button.id = work.id; // Définit l'ID du bouton comme l'ID du travail
    figure.appendChild(button); // Ajoute le bouton à la figure
}

// Ajoute la classe "selected" à une catégorie
function addSelectedClass(categoryId) {
    document.getElementById("category" + categoryId).classList.add("selected"); // Ajoute la classe "selected" à la catégorie
}

// Supprime la classe "selected" des catégories
function removeSelectedClass() {
    let filters = document.querySelectorAll(".category"); // Sélectionne tous les éléments de catégorie
    for (let i = 0; i < filters.length; i++) {
        filters[i].classList.remove("selected"); // Supprime la classe "selected" de chaque catégorie
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
