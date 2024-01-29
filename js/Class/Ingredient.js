class Ingredient extends Filter {
    constructor(name) {
        super(name);
        this.className = 'ingredientFilter'
    }

    recipeContains(recipes, ingredient) {
        for (let index = 0; index < recipes.length; index++) {
            for (let i = 0; i < selectedIngredients.length; index++) {
                let containsIng = false;

                for (let j = 0; j < recipes[index].ingredients.length; j++) {
                    if (recipes[index].ingredients[j].ingredient.toLowerCase() == selectedIngredients.get(i).toLowerCase()) {
                        containsIng = true;
                        break;
                    }
                }
                if (containsIng) {
                    sortedRecipesIng.add(recipes[index]);
                }
            }
        }
    }



    build(selectCallback, removeCallback, selectedIngredients) {
        let li = document.createElement('li');
        li.textContent = this.name;
        li.className = "filterIngredient";
        li.setAttribute('id', this.name);

        if(selectedIngredients.has(this.name)) {
            li.classList.add('selected');
        }

        li.addEventListener('click', () => {
            li.classList.toggle('selected');

            if(li.classList.contains('selected')) {
                selectCallback(this);
            } else {
                removeCallback(this);
            }

        });
        return li;
    }
}