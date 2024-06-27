const BASE_URL = "http://localhost:5678/api/";
const USERS_API = BASE_URL + "users/login";
const LOGIN_BUTTON = document.getElementById("se_connecter");

LOGIN_BUTTON.addEventListener("click", function() {
    loginUser();
});

function loginUser(){
    let user = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    }; 

    // Appel de l'API pour vérifier l'e-mail et le mot de passe de l'utilisateur
    fetch (USERS_API,{
        method: 'POST', 
        headers: {
             'Content-Type': 'application/json;charset=utf-8'
         },
        body: JSON.stringify(user) 
    })
    .then(response => {
        if (response.status === 200){ 
            return response.json(); 
        } else {
            loginError=document.getElementById("login_error");
            loginError.innerHTML="Erreur dans l’identifiant ou le mot de passe";
            loginError.style.display="flex"; 
            throw new Error('Erreur de connexion'); 
        }
    })
    .then(data => {
        if(data){ 
            localStorage.setItem("token", data.token);
            window.location.href = "index.html";
        }
    })
    .catch(error => {
        // Gestion des erreurs de connexion réseau
        console.error("Erreur de connexion :", error);
        let loginError = document.getElementById("login_error");
        loginError.innerHTML = "Erreur de connexion au serveur";
        loginError.style.display = "flex";
    });
}   
function logoutUser() {
    localStorage.removeItem("token");
    LOGIN_BUTTON.textContent = "Se connecter";
    window.location.href = "login.html";
}