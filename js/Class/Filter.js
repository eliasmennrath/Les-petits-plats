class Filter {

    constructor(name) {
        this.name = name;

        this.className = '';
    }

    containsInName(value) {
        if (this.name.toLowerCase().includes(value.toLowerCase().trim())) {
            return true;
        }
    }

    buildSelected(clickCallback) {
        let li = document.createElement('li');
        li.setAttribute('id', this.name+'Filter');
        li.className = "selectedFilter " + this.className;

        let p = document.createElement('p');
        p.textContent = this.name;

        let span = document.createElement('span');
        span.className = "fa-solid fa-xmark";

        li.appendChild(p);
        li.appendChild(span);

        span.addEventListener('click', () => {
            clickCallback(this);
            let listItem = document.getElementById(this.name);
            listItem.classList.remove('selected');
        });
        return li;
    }

    name() {
        return this.name.toLowerCase();
    }
}