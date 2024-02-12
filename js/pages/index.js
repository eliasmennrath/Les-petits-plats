const url = 'datas/recipes.json';

let recipes;
let resultRecipes = [];
let sortedRecipes = new Set();

let ingredients = new Set();
let appliances = new Set();
let ustensils = new Set();

let selectedIngredients = new Set();
let selectedAppliances = new Set();
let selectedUstensils = new Set();

let sortedRecipesIng = new Set();

const recipeContainer = document.getElementById('recipes');
const ingredientsList = document.getElementById('ingredientsList');
const appliancesList = document.getElementById('appliancesList');
const ustensilsList = document.getElementById('ustensilsList');

fetch(url).
then(response => {
    return response.json();
})
.then(data => {
    // Récupération des données
    recipes = data.recipes;
    resultRecipes = recipes;

    recipes.forEach((recipe, index) => {
        recipe = new Recipe(recipe);

        let card = recipe.build();
        recipeContainer.appendChild(card);

        recipes[index] = recipe;

        updateFilters(recipe);
    });

    filters();

    // Affichage du nombre de recettes
    let total = document.getElementById('totalRecipes');
    total.textContent = recipes.length + ' recettes';


    // Fonctionnalité de recherche
    const input = document.getElementById('searchInput');
    const submitBtn = document.getElementById('searchBtn');

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if(input.value.length == 0 || input.value.length >= 3) {
            let counter = 0;
            resultRecipes = [];
            sortedRecipes = new Set();
            sortedRecipesIng = new Set();

            recipeContainer.innerHTML = '';
            ingredientsList.innerHTML = "";
            appliancesList.innerHTML = "";
            ustensilsList.innerHTML = "";

            recipes.forEach(recipe => {
                if (recipe.containsInName(input.value) || recipe.containsInDescription(input.value) || recipe.containsInIngredient(input.value)) {
                    resultRecipes.push(recipe);
                }
            });

            resultRecipes.forEach(recipe => {
                if(recipe.containsAllIngredients(selectedIngredients) && recipe.containsAllAppliances(selectedAppliances) && recipe.containsAllUstensils(selectedUstensils)) {
                    sortedRecipes.add(recipe);
                }
            });


            ingredients = new Set();
            appliances = new Set();
            ustensils = new Set();
            sortedRecipes.forEach(recipe => { 
                updateFilters(recipe);

                let card = recipe.build();
                recipeContainer.appendChild(card);

                counter++;
            });

            filters();

            total.textContent = counter + ' recettes';
        }
    });


    // Fonctionnalité de filtre
    const filterIngredients = document.getElementById('ingredientsInput');
    const filterIngredientsBtn = document.getElementById('ingredientsBtn');
    const filterIngredientsClear = document.getElementById('ingredientsClear');
    const filterAppliances = document.getElementById('appliancesInput');
    const filterAppliancesBtn = document.getElementById('appliancesBtn');
    const filterAppliancesClear = document.getElementById('appliancesClear');
    const filterUstensils = document.getElementById('ustensilsInput');
    const filterUstensilsBtn = document.getElementById('ustensilsBtn');
    const filterUstensilsClear = document.getElementById('ustensilsClear');

    filterIngredientsBtn.addEventListener('click', () => {
        searchIngredient(ingredients, filterIngredients.value);
    });
    filterIngredientsClear.addEventListener('click', () => {
        filterIngredients.value = '';
        searchIngredient(ingredients, filterIngredients.value);
    });

    filterAppliancesBtn.addEventListener('click', () => {
        searchAppliance(appliances, filterAppliances.value)
    });
    filterAppliancesClear.addEventListener('click', () => {
        filterAppliances.value = '';
        searchAppliance(appliances, filterAppliances.value)
    });

    filterUstensilsBtn.addEventListener('click', () => {
        searchUstensil(ustensils, filterUstensils.value);
    });
    filterUstensilsClear.addEventListener('click', () => {
        filterUstensils.value = '';
        searchUstensil(ustensils, filterUstensils.value);
    });
});


// Toggle dropdown 
document.getElementById('dropdownIngredients').addEventListener('click', () => {
    document.getElementById('ingredientsWrapper').classList.toggle('active');
});
document.getElementById('dropdownAppliances').addEventListener('click', () => {
    document.getElementById('appliancesWrapper').classList.toggle('active');
});
document.getElementById('dropdownUstensils').addEventListener('click', () => {
    document.getElementById('ustensilsWrapper').classList.toggle('active');
});


/**
 * Functions
 */

function toFilterObjectArray(set, type) {
    switch (type) {
        case 'ingredients':
            return [...set].map((element) => new Ingredient(element));
        case 'appliances':
            return [...set].map((element) => new Appliance(element));
        case 'ustensils':
            return [...set].map((element) => new Ustensil(element));
    }
}

function buildList(filterArray, htmlList, selectedTags) {
    htmlList.innerHTML = "";
    filterArray.forEach(filter => {
        let listItem = filter.build(selectFilter, removeFilter, selectedTags);
        htmlList.appendChild(listItem);
    });
}

function updateFilters(recipe) {
    recipe.ingredients.forEach(ingredient => {
        ingredients.add(ingredient.ingredient.toLowerCase());
    });

    appliances.add(recipe.appliance.toLowerCase());

    recipe.ustensils.forEach(ustensil => {
        ustensils.add(ustensil.toLowerCase());
    });
}

function searchIngredient(ingredients, filterValue) {
    if(filterValue.length == 0 || filterValue.length >= 3) {
        ingredientsList.innerHTML = '';
        ingredients.forEach(element => {
            if (element.containsInName(filterValue)) {
                let listItem = element.build(selectFilter, removeFilter, selectedIngredients);
                ingredientsList.appendChild(listItem);
            }
        });
    }
}

function searchAppliance(appliances, filterValue) {
    if(filterValue.length == 0 || filterValue.length >= 3) {
        appliancesList.innerHTML = '';
        appliances.forEach(element => {
            if (element.containsInName(filterValue)) {
                let listItem = element.build(selectFilter, removeFilter, selectedAppliances);
                appliancesList.appendChild(listItem);
            }
        });
    }
}

function searchUstensil(ustensils, filterValue) {
    if(filterValue.length == 0 || filterValue.length >= 3) {
        ustensilsList.innerHTML = '';
        ustensils.forEach(element => {
            if (element.containsInName(filterValue)) {
                let listItem = element.build(selectFilter, removeFilter, selectedUstensils);
                ustensilsList.appendChild(listItem);
            }
        });
    }
}

function selectFilter(filter) {
    switch (filter.constructor.name) {
        case 'Ingredient':
            selectedIngredients.add(filter.name);
            break;
        case 'Appliance':
            selectedAppliances.add(filter.name);
            break;
        case 'Ustensil':
            selectedUstensils.add(filter.name);
            break;
    }

    document.getElementById('selectedList').appendChild(filter.buildSelected(removeFilter));

    filteredResult();
}

function removeFilter(filter) {
    switch (filter.constructor.name) {
        case 'Ingredient':
            selectedIngredients.delete(filter.name);
            break;
        case 'Appliance':
            selectedAppliances.delete(filter.name);
            break;
        case 'Ustensil':
            selectedUstensils.delete(filter.name);
            break;
    }    

    let target = document.getElementById(filter.name+'Filter');
    document.getElementById('selectedList').removeChild(target);

    filteredResult();
}

function filteredResult() {
    sortedRecipes = new Set();
    resultRecipes.forEach(recipe => {
        if(recipe.containsAllIngredients(selectedIngredients) && recipe.containsAllAppliances(selectedAppliances) && recipe.containsAllUstensils(selectedUstensils)) {
            sortedRecipes.add(recipe);
        }
    });

    recipeContainer.innerHTML = '';
    sortedRecipes.forEach(recipe => {
        let card = recipe.build();
        recipeContainer.appendChild(card);
    });

    ingredients = new Set();
    appliances = new Set();
    ustensils = new Set();
    sortedRecipes.forEach(recipe => { 
        updateFilters(recipe);
    });

    filters();

    document.getElementById('totalRecipes').textContent = sortedRecipes.size + ' recettes';
}

function filters() {
    ingredients = toFilterObjectArray(ingredients, 'ingredients');
    appliances = toFilterObjectArray(appliances, 'appliances');
    ustensils = toFilterObjectArray(ustensils, 'ustensils');

    buildList(ingredients, ingredientsList, selectedIngredients);
    buildList(appliances, appliancesList, selectedAppliances);
    buildList(ustensils, ustensilsList, selectedUstensils);
}