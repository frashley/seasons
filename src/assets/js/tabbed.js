((doc) => {
    let tabControls = doc.querySelectorAll('.tab-action');
    let tabSections = doc.querySelectorAll('.tabbed-content');

    if (!tabControls || !tabSections) {
        return;
    }

    let showTab = (e, index) => {
        e.preventDefault();

        // remove current active states
        removeActiveStates();

        // add active state to tab control
        tabControls[index].parentNode.classList.add('active');

        // hide all content
        hideAllTabbedContent();

        // show current tab section
        tabSections[index].classList.add('active');
    };

    let removeActiveStates = () => {
        for (var i = 0, len = tabControls.length; i < len; i++) {
            tabControls[i].parentNode.classList.remove('active');
        }
    };

    let hideAllTabbedContent = () => {
        for (var i = 0, len = tabSections.length; i < len; i++) {
            tabSections[i].classList.remove('active');
        }
    };

    // add click event to tabs
    for (var i = 0, len = tabControls.length; i < len; i++) {
        registerTabControls(tabControls[i], i);
    }

    function registerTabControls(item, index) {
        item.addEventListener('click', e => {
            showTab(e, index);
        });
    }

})(document);
