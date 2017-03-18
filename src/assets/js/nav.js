((global, doc) => {
    if (typeof document.body.classList !== 'object') {
        return;
    }

    let nav = doc.querySelector('#nav');
    let navMenuBtn = doc.querySelector('#nav-menu-btn');
    let navIconOpen = doc.querySelector('#nav-icon-open');
    let navIconClose = doc.querySelector('#nav-icon-close');
    let isMenuActive = false;
    let timer = 0;

    if (!nav || !navMenuBtn || !navIconOpen || !navIconClose) {
        return;
    }

    navMenuBtn.addEventListener('click', function (e) {
        e.preventDefault();

        if (isMenuActive === false) {
            show();
        } else {
            hide();
        }
    });

    // nav.addEventListener('click', function () {
    //     if (isMenuActive === true) {
    //         hide();
    //     }
    // });

    watchViewport(() => {
        if (isMenuActive === true) {
            hide();
        }
    });

    function watchViewport(cb) {
        // fire method on window resize once the resize event completes
        if (typeof addEventListener === 'function') {
            global.addEventListener('resize', function () {
                clearTimeout(timer);
                timer = setTimeout(cb, 100);
            }, false);
        }
    }

    function show() {
        nav.classList.add('expanded');
        navMenuBtn.classList.add('expanded');

        isMenuActive = true;
    }

    function hide() {
        nav.classList.remove('expanded');
        navMenuBtn.classList.remove('expanded');

        isMenuActive = false;
    }
})(window, document);
