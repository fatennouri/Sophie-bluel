const baseUrl = "http://localhost:5678/api/";
const usersApi = baseUrl + "users/login";
const loginButton = document.getElementById("se_connecter");

loginButton.addEventListener("click", function() {
    loginUser();
});

function loginUser() {
    let user = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    }; 

    // Appel de l'API pour vérifier l'e-mail et le mot de passe de l'utilisateur
    fetch(usersApi, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user) 
    })
    .then(response => {
        if (response.status === 200) { 
            return response.json(); 
        } else {
            let loginError = document.getElementById("login_error");
            loginError.innerHTML = "Erreur dans l’identifiant ou le mot de passe";
            loginError.style.display = "flex"; 
        }
    })
    .then(data => {
        if (data) { 
            localStorage.setItem("token", data.token);
            window.location.href = "index.html";
        }
    })
    .catch(error => {
        console.error('Erreur lors de la requête :', error);
        let loginError = document.getElementById("login_error");
        loginError.innerHTML = "Une erreur s'est produite lors de la connexion.";
        loginError.style.display = "flex";
    });
}   

function logoutUser() {
    localStorage.removeItem("token");
    loginButton.textContent = "Se connecter";
    window.location.href = "login.html";
}
