Set.prototype.get = function(index) { return [...this][index]; }

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
let sortedRecipesApp = new Set();
let sortedRecipesUst = new Set();

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

    for (let index = 0; index < recipes.length; index++) {
        let recipe = new Recipe(recipes[index]);

        let card = recipe.build();
        recipeContainer.appendChild(card);

        recipes[index] = recipe;

        updateFilters(recipe);        
    }


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
            sortedRecipesApp = new Set();
            sortedRecipesUst = new Set();

            recipeContainer.innerHTML = '';
            ingredientsList.innerHTML = "";
            appliancesList.innerHTML = "";
            ustensilsList.innerHTML = "";

            for (let index = 0; index < recipes.length; index++) {
                if(recipes[index].containsInName(input.value) || recipes[index].containsInDescription(input.value) || recipes[index].containsInIngredient(input.value)) {
                    resultRecipes.push(recipes[index]);
                }
            }

            for (let index = 0; index < resultRecipes.length; index++) {
                if(resultRecipes[index].containsAllIngredients(selectedIngredients) && resultRecipes[index].containsAllAppliances(selectedAppliances) && resultRecipes[index].containsAllUstensils(selectedUstensils)) {
                    sortedRecipes.add(resultRecipes[index]);
                }
            }

            ingredients = new Set();
            appliances = new Set();
            ustensils = new Set();

            for (let index = 0; index < sortedRecipes.size; index++) {
                
                updateFilters(sortedRecipes.get(index));

                let card = sortedRecipes.get(index).build();
                recipeContainer.appendChild(card);

                counter++;
            }

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


    for (let index = 0; index < filterArray.length; index++) {
        let listItem = filterArray[index].build(selectFilter, removeFilter, selectedTags);
        htmlList.appendChild(listItem);
    }
}

function updateFilters(recipe) {

    for (let index = 0; index < recipe.ingredients.length; index++) {
        ingredients.add(recipe.ingredients[index].ingredient.toLowerCase());
    }

    appliances.add(recipe.appliance.toLowerCase());

    for (let index = 0; index < recipe.ustensils.length; index++) {
        ustensils.add(recipe.ustensils[index].toLowerCase());
    }
}

function searchIngredient(ingredients, filterValue) {
    if(filterValue.length == 0 || filterValue.length >= 3) {
        ingredientsList.innerHTML = '';

        for (let index = 0; index < ingredients.length; index++) {
            if (ingredients[index].containsInName(filterValue)) {
                let listItem = ingredients[index].build(selectFilter, removeFilter, selectedIngredients);
                ingredientsList.appendChild(listItem);
            }
        }
    }
}

function searchAppliance(appliances, filterValue) {
    if(filterValue.length == 0 || filterValue.length >= 3) {
        appliancesList.innerHTML = '';

        for (let index = 0; index < appliances.length; index++) {
            if (appliances[index].containsInName(filterValue)) {
                let listItem = appliances[index].build(selectFilter, removeFilter, selectedAppliances);
                appliancesList.appendChild(listItem);
            }
        }
    }
}

function searchUstensil(ustensils, filterValue) {
    if(filterValue.length == 0 || filterValue.length >= 3) {
        ustensilsList.innerHTML = '';

        for (let index = 0; index < ustensils.length; index++) {
            if (ustensils[index].containsInName(filterValue)) {
                let listItem = ustensils[index].build(selectFilter, removeFilter, selectedUstensils);
                ustensilsList.appendChild(listItem);
            }
        }
    }
}

function selectIngredientFilter(ingredient) {
    let sortedRecipesIng = new Set();
    selectedIngredients.add(ingredient);
}

function selectApplianceFilter(appliance) {
    let sortedRecipesApp = new Set();
    selectedAppliances.add(appliance);

    return selectedAppliances;
}

function selectUstensilFilter(ustensil) {
    let sortedRecipesUst = new Set();
    selectedUstensils.add(ustensil);

    return selectedUstensils;
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

    for (let index = 0; index < resultRecipes.length; index++) {
        if(resultRecipes[index].containsAllIngredients(selectedIngredients) && resultRecipes[index].containsAllAppliances(selectedAppliances) && resultRecipes[index].containsAllUstensils(selectedUstensils)) {
            sortedRecipes.add(resultRecipes[index]);
        }
    }

    recipeContainer.innerHTML = '';

    for (let index = 0; index < sortedRecipes.size; index++) {
        let card = sortedRecipes.get(index).build();
        recipeContainer.appendChild(card);
    }

    ingredients = new Set();
    appliances = new Set();
    ustensils = new Set();

    for (let index = 0; index < sortedRecipes.size; index++) {
        updateFilters(sortedRecipes.get(index));
    }

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