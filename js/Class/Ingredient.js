class Ingredient extends Filter {
    constructor(name) {
        super(name);
        this.className = 'ingredientFilter'
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