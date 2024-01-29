class Ustensil extends Filter {
    constructor(name) {
        super(name);

        this.className = 'ustensilFilter'
    }

    build(selectCallback, removeCallback, selectedUstensils) {
        let li = document.createElement('li');
        li.textContent = this.name;
        li.className = "filterUstensil";
        li.setAttribute('id', this.name);

        if(selectedUstensils.has(this.name)) {
            li.classList.add('selected');
        }

        li.addEventListener('click', () => {

            if(!li.classList.contains('selected')) {
                selectCallback(this);
            } else {
                removeCallback(this);
            }

        });
        return li;
    }
}