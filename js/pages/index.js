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

// Création des listes
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

    // Création d'une variable temporaire afin de récupérer un tableau de Class Recipe
    recipes.forEach((recipe, index) => {
        recipe = new Recipe(recipe);

        let card = recipe.build();
        document.getElementById('recipes').appendChild(card);

        recipes[index] = recipe;

        updateFilters(recipe);
    });


    // Transformation des tableaux en tableaux d'objet
    ingredients = toFilterObjectArray(ingredients, 'ingredients');
    appliances = toFilterObjectArray(appliances, 'appliances');
    ustensils = toFilterObjectArray(ustensils, 'ustensils');



    buildList(ingredients, ingredientsList, selectedIngredients);
    buildList(appliances, appliancesList, selectedAppliances);
    buildList(ustensils, ustensilsList, selectedUstensils);


    let total = document.getElementById('totalRecipes');
    total.textContent = recipes.length + ' recettes';


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


            document.getElementById('recipes').innerHTML = '';

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
                document.getElementById('recipes').appendChild(card);

                counter++;
            });

            ingredients = toFilterObjectArray(ingredients, 'ingredients');
            appliances = toFilterObjectArray(appliances, 'appliances');
            ustensils = toFilterObjectArray(ustensils, 'ustensils');

            buildList(ingredients, ingredientsList, selectedIngredients);
            buildList(appliances, appliancesList, selectedAppliances);
            buildList(ustensils, ustensilsList, selectedUstensils);

            total.textContent = counter + ' recettes';
        }
    });

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

// function toIngredientFilterObjectArray(set) {
//     return [...set].map((element) => new Ingredient(element));
// }

// function toApplianceFilterObjectArray(set) {
//     return [...set].map((element) => new Appliance(element));
// }

// function toUstensilFilterObjectArray(set) {
//     return [...set].map((element) => new Ustensil(element));
// }

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

// function searchFilter(filterArray, filterValue, htmlList) {
//     if(filterValue.length == 0 || filterValue.length >= 3) {
//         htmlList.innerHTML = '';
//         filterArray.forEach(element => {
//             if (element.containsInName(filterValue)) {
//                 let listItem = element.build(selectFilter, removeFilter,);
//                 htmlList.appendChild(listItem);
//             }
//         });
//     }
// }

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

function searchUstensil(ustensils, filterVa) {
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


function selectIngredientFilter(ingredient) {
    let sortedRecipesIng = new Set();
    selectedIngredients.add(ingredient);


    // return sortedRecipesIng;


    // var sortedRecipes = resultRecipes.filter(recipe => {
    //     // For each selected ingredients
    //     for(let ingredient of selectedIngredients) {
    //         // If selected ingredient doesn't match any recipe's ingredients
    //         if(!recipe.ingredients.map(ing => ing.ingredient.toLowerCase()).includes(ingredient.toLowerCase())) {
    //             // Remove recipe from array + pass to next recipe
    //             return false;
    //         }
    //     };
    //     // Keep recipe in array
    //     return true;
    // });

}


function selectApplianceFilter(appliance) {
    let sortedRecipesApp = new Set();
    selectedAppliances.add(appliance);

    return selectedAppliances;

    // resultRecipes.forEach(recipe => {
    //     selectedAppliances.forEach(selectedAppliance => {
    //         // Init boolean to false
    //         if(recipe.appliance.toLowerCase() == selectedAppliance.toLowerCase()) {
    //             sortedRecipesApp.add(recipe);
    //         }
    //     });
    // });

    // return sortedRecipesApp;
}

function selectUstensilFilter(ustensil) {
    let sortedRecipesUst = new Set();
    selectedUstensils.add(ustensil);

    return selectedUstensils;

    // resultRecipes.forEach(recipe => {
    //     selectedUstensils.forEach(selectedUstensil => {
    //         // Init boolean to false
    //         let containsUst = false;
    //         recipe.ustensils.forEach(ustensil => {
    //             if(ustensil.toLowerCase() == selectedUstensil.toLowerCase()) {
    //                 containsUst = true;
    //                 return;
    //             }
    //         })
    //         if(containsUst) {
    //             sortedRecipesUst.add(recipe);
    //         }
    //     });
    // });
    // return sortedRecipesUst;
}


function selectFilter(filter) {
    switch (filter.constructor.name) {
        case 'Ingredient':
            // sortedRecipesIng = selectIngredientFilter(filter.name);
            selectedIngredients.add(filter.name);
            break;
        case 'Appliance':
            // sortedRecipesApp = selectApplianceFilter(filter.name);
            selectedAppliances.add(filter.name);
            break;
        case 'Ustensil':
            // sortedRecipesUst = selectUstensilFilter(filter.name);
            selectedUstensils.add(filter.name);
            break;
    }

    console.log(selectedUstensils);

    sortedRecipes = new Set();
    resultRecipes.forEach(recipe => {
        if(recipe.containsAllIngredients(selectedIngredients) && recipe.containsAllAppliances(selectedAppliances) && recipe.containsAllUstensils(selectedUstensils)) {
            sortedRecipes.add(recipe);
        }
    })

    document.getElementById('selectedList').appendChild(filter.buildSelected(removeFilter));



    document.getElementById('recipes').innerHTML = '';
    sortedRecipes.forEach(recipe => {
        let card = recipe.build();
        document.getElementById('recipes').appendChild(card);
    });

    ingredients = new Set();
    appliances = new Set();
    ustensils = new Set();
    sortedRecipes.forEach(recipe => { 
        updateFilters(recipe);
    });

    ingredients = toFilterObjectArray(ingredients, 'ingredients');
    appliances = toFilterObjectArray(appliances, 'appliances');
    ustensils = toFilterObjectArray(ustensils, 'ustensils');

    buildList(ingredients, ingredientsList, selectedIngredients);
    buildList(appliances, appliancesList, selectedAppliances);
    buildList(ustensils, ustensilsList, selectedUstensils);

    document.getElementById('totalRecipes').textContent = sortedRecipes.size + ' recettes';
}


function removeIngredientFilter(ingredient) {
    selectedIngredients.delete(ingredient);
}

function removeFilter(filter) {
    switch (filter.constructor.name) {
        case 'Ingredient':
            // sortedRecipesIng = selectIngredientFilter(filter.name);
            selectedIngredients.delete(filter.name);
            break;
        case 'Appliance':
            // sortedRecipesApp = selectApplianceFilter(filter.name);
            selectedAppliances.delete(filter.name);
            break;
        case 'Ustensil':
            // sortedRecipesUst = selectUstensilFilter(filter.name);
            selectedUstensils.delete(filter.name);
            break;
    }    


    sortedRecipes = new Set();
    resultRecipes.forEach(recipe => {
        if(recipe.containsAllIngredients(selectedIngredients) && recipe.containsAllAppliances(selectedAppliances) && recipe.containsAllUstensils(selectedUstensils)) {
            sortedRecipes.add(recipe);
        }
    })

    let target = document.getElementById(filter.name+'Filter');
    document.getElementById('selectedList').removeChild(target);


    document.getElementById('recipes').innerHTML = '';
    sortedRecipes.forEach(recipe => {
        let card = recipe.build();
        document.getElementById('recipes').appendChild(card);
    });

    ingredients = new Set();
    appliances = new Set();
    ustensils = new Set();
    sortedRecipes.forEach(recipe => { 
        updateFilters(recipe);
    });

    ingredients = toFilterObjectArray(ingredients, 'ingredients');
    appliances = toFilterObjectArray(appliances, 'appliances');
    ustensils = toFilterObjectArray(ustensils, 'ustensils');

    buildList(ingredients, ingredientsList, selectedIngredients);
    buildList(appliances, appliancesList, selectedAppliances);
    buildList(ustensils, ustensilsList, selectedUstensils);


    document.getElementById('totalRecipes').textContent = sortedRecipes.size + ' recettes';
}