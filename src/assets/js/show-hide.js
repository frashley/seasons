((doc) => {
    let containers = doc.querySelectorAll('.parent'),
        i = 0,
        len = containers.length;

    if (!containers || len < 1 || typeof doc.body.classList !== 'object') {
        return;
    }

    for (; i < len; i++) {
        containers[i].addEventListener('click', toggle);
    }

    function toggle() {
        if (this.classList.contains('expanded')) {
            hide(this);
        } else {
            show(this);
        }
    }

    function show(container) {
        container.classList.add('expanded');
    }

    function hide(container) {
        container.classList.remove('expanded');
    }
})(document);
