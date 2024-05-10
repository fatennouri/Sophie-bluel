// Définition des constantes pour l'URL de base de l'API et l'endpoint spécifique pour la connexion des utilisateurs
const BASE_URL = "http://localhost:5678/api/";
const USERS_API = BASE_URL + "users/login";
const LOGIN_BUTTON = document.getElementById("se_connecter");

// Ajout d'un écouteur d'événement au clic sur le bouton de connexion
LOGIN_BUTTON.addEventListener("click", function() {
    loginUser();
});

// Fonction pour gérer le processus de connexion de l'utilisateur
function loginUser(){
    // Récupération de l'e-mail et du mot de passe saisis par l'utilisateur
    let user = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    }; 

    // Appel de l'API pour vérifier l'e-mail et le mot de passe de l'utilisateur
    fetch (USERS_API,{
        method: 'POST', // Utilisation de la méthode POST pour envoyer les données
        headers: {
             'Content-Type': 'application/json;charset=utf-8' // Spécification du type de contenu JSON dans l'en-tête de la requête
         },
        body: JSON.stringify(user) // Conversion des données utilisateur en format JSON
    })
    .then(response => {
        if (response.status === 200){ // Vérification si la réponse est réussie (code de statut HTTP 200)
            return response.json(); // Conversion de la réponse en format JSON
        } else {
            // Affichage d'un message d'erreur si l'e-mail ou le mot de passe est incorrect
            loginError=document.getElementById("login_error");
            loginError.innerHTML="Erreur dans l’identifiant ou le mot de passe";
            loginError.style.display="flex"; // Affichage du message d'erreur de manière visible
        }
    })
    .then(data => {
        if(data){ // Si la connexion est réussie
            // STOCKAGE DU TOKEN DANS LE SESSION STORAGE
            sessionStorage.setItem("token", data.token);
            // REDIRECTION VERS LA PAGE D'ACCUEIL
             window.location.href = "index.html";
        }
    })
}   

// Fonction pour gérer le processus de déconnexion de l'utilisateur
function logoutUser() {
    // Supprimer le token d'authentification du sessionStorage
    sessionStorage.removeItem("token");
    // Changer le texte du bouton de connexion en "Se connecter"
    LOGIN_BUTTON.textContent = "Se connecter";
    // Redirection vers la page de connexion (ou une autre page de votre choix)
    window.location.href = "login.html";
}
