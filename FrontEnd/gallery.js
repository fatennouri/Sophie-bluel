const baseUrl = "http://localhost:5678/api/";
const worksApi = baseUrl + "works";
const categoryApi = baseUrl + "categories";
const galleryDiv = document.querySelector(".gallery");
const filterDiv = document.querySelector(".filter");

fetchWorks(galleryDiv, false);

function refreshWorks(targetDiv, deleteButton) {
  targetDiv.innerHTML = "";
  fetchWorks(targetDiv, deleteButton);
}
// Récupération des travaux
function fetchWorks(targetDiv, deleteButton) {
  fetch(worksApi)
    .then((response) => response.json())
    .then((works) => {
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
fetch(categoryApi)
  .then((response) => response.json())
  .then((categories) => {
    let uniqueCategories = [];
    let nouvelleCategorie = { id: 0, name: "Tous" };

    createFilterButton(nouvelleCategorie);
    addSelectedClass(nouvelleCategorie.id);

    categories.forEach((category) => {
      if (
        !uniqueCategories.some(
          (c) => c.id === category.id && c.name === category.name
        )
      ) {
        uniqueCategories.push(category);
        createFilterButton(category);
      }
    });
  });

function createFilterButton(category) {
  let categoryLink = document.createElement("a");
  categoryLink.id = "category" + category.id;
  categoryLink.classList.add("category");
  categoryLink.innerHTML = category.name;
  filterDiv.appendChild(categoryLink);

  categoryLink.addEventListener("click", function () {
    filterWorksByCategory(category.id);
  });
}

// Filtre les travaux par catégorie
function filterWorksByCategory(categoryId) {
  galleryDiv.innerHTML = "";
  for (let i = 0; i < workList.length; i++) {
    if (workList[i].categoryId === categoryId || categoryId === 0) {
      createWork(workList[i], galleryDiv, false);
    }
  }
  removeSelectedClass();
  addSelectedClass(categoryId);
}

gestionLogin();

// Création d'un bouton de suppression pour chaque image
function createDeleteButton(figure, work) {
  let button = document.createElement("i");
  button.classList.add("fa-regular", "fa-trash-can");
  button.addEventListener("click", deleteWork);
  button.id = work.id;
  figure.appendChild(button);
}

function addSelectedClass(categoryId) {
  document.getElementById("category" + categoryId).classList.add("selected");
}

function removeSelectedClass() {
  let filters = document.querySelectorAll(".category");
  for (let i = 0; i < filters.length; i++) {
    filters[i].classList.remove("selected");
  }
}

// Gestion de l'état de connexion
function gestionLogin() {
  if (localStorage.getItem("token")) {
    let loginLogoutLink = document.getElementById("login_logout");
    loginLogoutLink.textContent = "logout";

    let bandeauEdit = document.getElementById("edition");
    bandeauEdit.style.display = "flex";

    let projetModif = document.getElementById("modif_projet");
    projetModif.style.display = "inline";

    let buttonFilter = document.querySelector(".filter");
    buttonFilter.style.display = "none";

    loginLogoutLink.addEventListener("click", function (event) {
      event.preventDefault();
      localStorage.removeItem("token");
      window.location.href = "index.html";
    });
  }
}
