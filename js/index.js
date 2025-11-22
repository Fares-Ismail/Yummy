const rowData = document.getElementById("rowData");
const searchContainer = document.getElementById("searchContainer");
const openCloseBtn = document.getElementById("openCloseBtn");

let submitBtn;

document.addEventListener("DOMContentLoaded", async () => {
    await searchByName("");
    document.querySelector(".page-loader").style.display = "none";
    document.body.style.overflow = "visible";
});

function openSideNav() {
    const menu = document.querySelector(".side-nav");
    menu.style.left = "0";

    openCloseBtn.classList.remove("fa-align-justify");
    openCloseBtn.classList.add("fa-x");

    document.querySelectorAll(".nav-links li").forEach((li, i) => {
        li.style.top = "0px";
        li.style.transition = `${(i + 5) * 0.1}s`;
    });
}

function closeSideNav() {
    const menu = document.querySelector(".side-nav");
    const width = document.querySelector(".side-nav-panel").offsetWidth;
    menu.style.left = `-${width}px`;

    openCloseBtn.classList.add("fa-align-justify");
    openCloseBtn.classList.remove("fa-x");

    document.querySelectorAll(".nav-links li").forEach((li) => {
        li.style.top = "300px";
        li.style.transition = `.5s`;
    });
}

closeSideNav();

openCloseBtn.addEventListener("click", () => {
    let left = document.querySelector(".side-nav").style.left;
    if (left === "0px") closeSideNav();
    else openSideNav();
});

document.querySelectorAll(".nav-links li").forEach((li) => {
    li.addEventListener("click", () => {
        const action = li.dataset.action;

        if (action === "showSearch") showSearchInputs();
        if (action === "ingredients") getIngredients();
        if (action === "categories") getCategories();
        if (action === "contacts") showContacts();
        if (action === "area") getArea();

        closeSideNav();
    });
});

function displayMeals(arr) {
    let html = "";
    arr.forEach((meal) => {
        html += `
        <div class="col-md-3">
            <div class="meal-card position-relative overflow-hidden rounded-2 clickable" data-id="${meal.idMeal}">
                <img class="w-100" src="${meal.strMealThumb}">
                <div class="meal-overlay position-absolute d-flex align-items-center text-black p-2">
                    <h3>${meal.strMeal}</h3>
                </div>
            </div>
        </div>`;
    });

    rowData.innerHTML = html;

    document.querySelectorAll(".meal-card").forEach((meal) => {
        meal.addEventListener("click", () => {
            getMealDetails(meal.dataset.id);
        });
    });
}

function showLoader() {
    document.querySelector(".content-loader").style.display = "flex";
}

function hideLoader() {
    document.querySelector(".content-loader").style.display = "none";
}
async function getCategories() {
    rowData.innerHTML = "";
    showLoader();
    searchContainer.innerHTML = "";

    let data = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    data = await data.json();

    displayCategories(data.categories);
    hideLoader();
}

function displayCategories(arr) {
    let html = "";
    arr.forEach((cat) => {
        html += `
        <div class="col-md-3">
            <div class="meal-card position-relative overflow-hidden rounded-2 clickable" data-category="${cat.strCategory}">
                <img class="w-100" src="${cat.strCategoryThumb}">
                <div class="meal-overlay position-absolute text-center text-black p-2">
                    <h3>${cat.strCategory}</h3>
                    <p>${cat.strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
            </div>
        </div>`;
    });

    rowData.innerHTML = html;

    document.querySelectorAll("[data-category]").forEach((el) => {
        el.addEventListener("click", () => getCategoryMeals(el.dataset.category));
    });
}

async function getArea() {
    rowData.innerHTML = "";
    showLoader();
    searchContainer.innerHTML = "";

    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    res = await res.json();

    displayArea(res.meals);
    hideLoader();
}

function displayArea(arr) {
    let html = "";
    arr.forEach((area) => {
        html += `
        <div class="col-md-3">
            <div class="rounded-2 text-center clickable" data-area="${area.strArea}">
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h3>${area.strArea}</h3>
            </div>
        </div>`;
    });

    rowData.innerHTML = html;

    document.querySelectorAll("[data-area]").forEach((el) => {
        el.addEventListener("click", () => getAreaMeals(el.dataset.area));
    });
}

async function getIngredients() {
    rowData.innerHTML = "";
    showLoader();
    searchContainer.innerHTML = "";

    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    res = await res.json();

    displayIngredients(res.meals.slice(0, 20));
    hideLoader();
}

function displayIngredients(arr) {
    let html = "";
    arr.forEach((ing) => {
        html += `
        <div class="col-md-3">
            <div class="rounded-2 text-center clickable" data-ingredient="${ing.strIngredient}">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3>${ing.strIngredient}</h3>
                <p>${(ing.strDescription || "").split(" ").slice(0, 20).join(" ")}</p>
            </div>
        </div>`;
    });

    rowData.innerHTML = html;

    document.querySelectorAll("[data-ingredient]").forEach((el) => {
        el.addEventListener("click", () => getIngredientsMeals(el.dataset.ingredient));
    });
}

async function getCategoryMeals(cat) {
    rowData.innerHTML = "";
    showLoader();

    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`);
    res = await res.json();

    displayMeals(res.meals.slice(0, 20));
    hideLoader();
}

async function getAreaMeals(area) {
    rowData.innerHTML = "";
    showLoader();

    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    res = await res.json();

    displayMeals(res.meals.slice(0, 20));
    hideLoader();
}

async function getIngredientsMeals(ing) {
    rowData.innerHTML = "";
    showLoader();

    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ing}`);
    res = await res.json();

    displayMeals(res.meals.slice(0, 20));
    hideLoader();
}

async function getMealDetails(id) {
    closeSideNav();
    rowData.innerHTML = "";
    showLoader();
    searchContainer.innerHTML = "";

    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    res = await res.json();

    displayMealDetails(res.meals[0]);
    hideLoader();
}

function displayMealDetails(meal) {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredientsList += `
            <li class="alert alert-info m-2 p-1">
                ${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}
            </li>`;
        }
    }

    let tags = meal.strTags ? meal.strTags.split(",") : [];
    let tagsList = tags.map(t => `<li class="alert alert-danger m-2 p-1">${t}</li>`).join("");

    let html = `
        <div class="col-md-4">
            <img class="w-100 rounded-3" src="${meal.strMealThumb}">
            <h2>${meal.strMeal}</h2>
        </div>

        <div class="col-md-8">
            <h2>Instructions</h2>
            <p>${meal.strInstructions}</p>
            <h3><span class="fw-bolder">Area:</span> ${meal.strArea}</h3>
            <h3><span class="fw-bolder">Category:</span> ${meal.strCategory}</h3>

            <h3>Recipes:</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">${ingredientsList}</ul>

            <h3>Tags:</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">${tagsList}</ul>

            <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
            <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
        </div>
    `;

    rowData.innerHTML = html;
}

function showSearchInputs() {
    searchContainer.innerHTML = `
    <div class="row py-4">
        <div class="col-md-6">
            <input id="nameSearch" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input id="letterSearch" class="form-control bg-transparent text-white" type="text" maxlength="1" placeholder="Search By First Letter">
        </div>
    </div>`;

    rowData.innerHTML = "";

       document.getElementById("nameSearch").addEventListener("input", (e) => {
        searchByName(e.target.value);
    });

    document.getElementById("letterSearch").addEventListener("input", (e) => {
        const letter = e.target.value;
        if (letter) searchByFirstLetter(letter);
        else rowData.innerHTML = "";
    });
}

async function searchByName(name) {
    showLoader();
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
    res = await res.json();

    if (res.meals) displayMeals(res.meals);
    else rowData.innerHTML = "";

    hideLoader();
}

async function searchByFirstLetter(letter) {
    showLoader();
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    res = await res.json();

    if (res.meals) displayMeals(res.meals);
    else rowData.innerHTML = "";

    hideLoader();
}

function showContacts() {
    searchContainer.innerHTML = "";

    rowData.innerHTML = `
    <div class="contact d-flex justify-content-center align-items-center">
        <div class="container w-75 text-center">
            <div class="row g-4">
                <div class="col-md-6">
                    <input id="nameInput" type="text" class="form-control" placeholder="Name">
                    <div id="nameAlert" class="alert alert-danger mt-2 d-none">Invalid Name</div>
                </div>
                <div class="col-md-6">
                    <input id="emailInput" type="email" class="form-control" placeholder="Email">
                    <div id="emailAlert" class="alert alert-danger mt-2 d-none">Invalid Email</div>
                </div>
                <div class="col-md-6">
                    <input id="phoneInput" type="text" class="form-control" placeholder="Phone">
                    <div id="phoneAlert" class="alert alert-danger mt-2 d-none">Invalid Phone</div>
                </div>
                <div class="col-md-6">
                    <input id="ageInput" type="number" class="form-control" placeholder="Age">
                    <div id="ageAlert" class="alert alert-danger mt-2 d-none">Invalid Age</div>
                </div>
                <div class="col-md-6">
                    <input id="passwordInput" type="password" class="form-control" placeholder="Password">
                    <div id="passwordAlert" class="alert alert-danger mt-2 d-none">Weak Password</div>
                </div>
                <div class="col-md-6">
                    <input id="repasswordInput" type="password" class="form-control" placeholder="Re-enter Password">
                    <div id="repasswordAlert" class="alert alert-danger mt-2 d-none">Passwords don't match</div>
                </div>
            </div>
            <button id="submitBtn" class="btn btn-outline-danger mt-3" disabled>Submit</button>
        </div>
    </div>
    `;

    initContactValidation();
}
function initContactValidation() {
    const nameInput = document.getElementById("nameInput");
    const emailInput = document.getElementById("emailInput");
    const phoneInput = document.getElementById("phoneInput");
    const ageInput = document.getElementById("ageInput");
    const passwordInput = document.getElementById("passwordInput");
    const repasswordInput = document.getElementById("repasswordInput");
    submitBtn = document.getElementById("submitBtn");

    const validators = {
        name: /^[A-Za-z ]{3,}$/,
        email: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
        phone: /^\d{10,}$/,
        age: /^([1-9][0-9]?)$/,
        password: /^.{6,}$/
    };

    function validateField(input, alertBox, regex) {
        if (regex.test(input.value)) {
            alertBox.classList.add("d-none");
            return true;
        } else {
            alertBox.classList.remove("d-none");
            return false;
        }
    }

    function validateRepassword() {
        const alertBox = document.getElementById("repasswordAlert");
        if (passwordInput.value === repasswordInput.value && passwordInput.value !== "") {
            alertBox.classList.add("d-none");
            return true;
        }
        alertBox.classList.remove("d-none");
        return false;
    }

    function checkForm() {
        const valid =
            validateField(nameInput, document.getElementById("nameAlert"), validators.name) &&
            validateField(emailInput, document.getElementById("emailAlert"), validators.email) &&
            validateField(phoneInput, document.getElementById("phoneAlert"), validators.phone) &&
            validateField(ageInput, document.getElementById("ageAlert"), validators.age) &&
            validateField(passwordInput, document.getElementById("passwordAlert"), validators.password) &&
            validateRepassword();

        submitBtn.disabled = !valid;
    }

    nameInput.addEventListener("input", checkForm);
    emailInput.addEventListener("input", checkForm);
    phoneInput.addEventListener("input", checkForm);
    ageInput.addEventListener("input", checkForm);
    passwordInput.addEventListener("input", checkForm);
    repasswordInput.addEventListener("input", checkForm);
}