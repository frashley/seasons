class Accordion {

    constructor(accordions) {
        this.accordions = accordions;

        this.init();
    }

    init() {
        this.registerAccordions();
    }

    registerAccordions() {
        let self = this;
        let len = this.accordions.length;

        while (len--) {
            this.accordions[len].querySelector('.heading').addEventListener('click', function () {
                self.toggle(this);
            });
        }
    }

    toggle(heading) {
        if (heading.parentNode.classList.contains('active')) {
            this.hide(heading.parentNode);
        } else {
            this.show(heading.parentNode);
        }
    }

    show(accordion) {
        let content = accordion.querySelector('.content');

        accordion.classList.add('active');
        accordion.querySelector('.content').style.maxHeight = content.scrollHeight + 'px';
    }

    hide(accordion) {
        accordion.classList.remove('active');
        accordion.querySelector('.content').style.maxHeight = '0px';
    }

}

if (document.querySelectorAll('.accordion').length) {
    let accordion = new Accordion(document.querySelectorAll('.accordion'));
}