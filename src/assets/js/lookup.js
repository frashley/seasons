class Lookup {

    constructor(lookupField, lookupResults) {
        this.lookupField = lookupField;
        this.lookupResults = lookupResults;
        this.resultItemFocusedIndex = 0;

        this.init();
    }

    init() {
        this.registerKeyup();
        this.registerLookupResults();
        this.registerClickOusideResults();
    }

    registerKeyup() {
        this.lookupField.addEventListener('keyup', e => {
            if (this.lookupField.value.length > 2) {
                this.getLookupResults().then(response => {
                    this.lookupResults.innerHTML = this.buildHTML(response);

                    this.scrollResults(e.keyCode);
                }, function (err) {
                    console.error(err);
                }).catch(function (err) {
                    console.error(err);
                });
            } else {
                this.lookupResults.innerHTML = '';
            }
        });
    }

    registerLookupResults() {
        this.lookupResults.addEventListener('click', e => {
            e.preventDefault();

            let target = null;

            if (e.srcElement.className === 'action') {
                target = e.srcElement;
            }

            if (e.srcElement.parentNode.className === 'action') {
                target = e.srcElement.parentNode;
            }

            if (target) {
                this.setLookupValue(target.querySelector('.heading').innerHTML);
            }

            return;
        });
    }

    registerClickOusideResults() {
        document.addEventListener('click', e => {
            // clear lookup results
            this.lookupResults.innerHTML = '';
        });

        this.lookupResults.parentNode.addEventListener('click', e => {
            e.stopPropagation();
        });
    }

    setLookupValue(str) {
        // clear results
        this.lookupResults.innerHTML = '';

        // input value = title
        this.lookupField.value = str;
    }

    getLookupResults() {
        return new Promise( (resolve, reject) => {
            let data = this.getData();

            if (data !== null) {
                resolve(data);
            } else {
                reject('Something has gone terribly wrong.');
            }
        });
    }

    scrollResults(code) {
        let items = this.lookupResults.querySelectorAll('.item');
        let len = items.length;

        if (code === 40 || code === 38) {
            this.removeAllActiveStates();
        }

        // 40 - arrow down
        if (code === 40) {
            if (this.resultItemFocusedIndex === len - 1) {
                // end, so start over
                this.resultItemFocusedIndex = 0;
            } else {
                this.resultItemFocusedIndex += 1;
            }
        }
        
        // 38 - arrow up
        if (code === 38) {
            if (this.resultItemFocusedIndex === 0) {
                this.resultItemFocusedIndex = len - 1;
            } else {
                this.resultItemFocusedIndex -= 1;
            }
        }

        items[this.resultItemFocusedIndex].classList.add('active');
    }

    removeAllActiveStates() {
        let items = this.lookupResults.querySelectorAll('.item');
        let len = items.length;

        while (len--) {
            items[len].classList.remove('active');
        }
    }

    buildHTML(ary) {
        let len = ary.length;
        let i = 0;
        let html = '';

        for (i = 0; i < len; i++) {
            if (ary[i].hasOwnProperty('image') && ary[i] !== '') {
                html += `<li class="item">
                        <a class="action" href="#">
                            <div class="media">
                                <img class="media-image" src="${ary[i].image}" alt="" />
                                <div class="content">
                                    <h5 class="heading">${ary[i].title}</h5>
                                    <p class="description">${ary[i].description}</p>
                                </div>
                            </div>
                        </a>
                    </li>`;
            } else {
                html += `<li class="item">
                        <a class="action" href="#">
                            <h3 class="heading">${ary[i].title}</h3>
                            <p class="description">${ary[i].description}</p>
                        </a>
                    </li>`;
            }
        }

        return html;
    }

    getData() {
        return [{
            "image": "//placekitten.com/320/320",
            "title": "Mumblecore trust fund",
            "description": "Mumblecore trust fund bushwick vegan locavore, coloring book franzen vape offal direct trade fingerstache fanny pack."
        }, {
            "title": "Waistcoat swag air plant",
            "description": "Waistcoat swag air plant, asymmetrical +1 taxidermy cornhole drinking vinegar YOLO pork belly stumptown. Direct trade whatever tilde, pok pok yr kinfolk chia squid hexagon vinyl fingerstache unicorn bicycle rights narwhal."
        }, {
            "title": "Tofu hoodie",
            "description": "Tofu hoodie tousled plaid literally, kogi semiotics PBR&amp;B sriracha. Tbh kitsch succulents subway tile craft beer."
        }, {
            "title": "Farm-to-table stumptown retro",
            "description": "Farm-to-table stumptown retro, raclette lo-fi prism wayfarers paleo lyft hella offal cliche brunch. Ramps chicharrones food truck distillery subway tile flexitarian."
        }];
    }
}

if (document.querySelector('#lookup-field') && document.querySelector('#lookup-results')) {
    let lookup = new Lookup(
        document.querySelector('#lookup-field'),
        document.querySelector('#lookup-results')
    );
}