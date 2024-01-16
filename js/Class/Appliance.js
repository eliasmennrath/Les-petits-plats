class Appliance extends Filter {
    constructor(name) {
        super(name);

        this.className = 'applianceFilter'
    }

    build(selectCallback, removeCallback, selectedAppliances) {
        let li = document.createElement('li');
        li.textContent = this.name;
        li.className = "filterAppliance";
        li.setAttribute('id', this.name);

        if(selectedAppliances.has(this.name) ) {
            li.classList.add('selected');
        }

        li.addEventListener('click', () => {
            // selectApplianceFilter(this.name)
            li.classList.toggle('selected');

            if(li.classList.contains('selected')) {
                selectCallback(this);
            } else {
                removeCallback(this);
            }

            // selectFilter(this);
        });
        return li;
    }
}