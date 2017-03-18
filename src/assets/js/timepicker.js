/* globals moment */
class Timepicker {
    constructor(index = 0, options = {
        format: 'YYYY-MM-DD',
        locale: 'en'
    }) {
        moment.locale(options.locale);

        this.options = options;
        this.time = moment();
        this.index = index;
    }

    renderTimepicker() {
        let html =
            `<div class="timepicker hidden">
				<div class="control">
					<button class="isjs-hour-up">
						<i aria-hidden="true" class="arrow-up"></i>
						<span class="sr-only">Up</span>
					</button>
					<span class="isjs-hour">${this.time.format('hh')}</span>
					<button class="isjs-hour-down">
						<i aria-hidden="true" class="arrow-down"></i>
						<span class="sr-only">Down</span>
					</button>
				</div>
				<div class="control">
					<span class="text">:</span>
				</div>
				<div class="control">
					<button class="isjs-minute-up">
						<i aria-hidden="true" class="arrow-up"></i>
						<span class="sr-only">Up</span>
					</button>
					<span class="isjs-minute">${this.time.format('mm')}</span>
					<button class="isjs-minute-down">
						<i aria-hidden="true" class="arrow-down"></i>
						<span class="sr-only">Down</span>
					</button>
				</div>
				<div class="ampm">
					<button class="isjs-am ${this.time.format('a') === 'am' ? 'active' : ''}" role="button">AM</button>
					<button class="isjs-pm ${this.time.format('a') === 'pm' ? 'active' : ''}" role="button">PM</button>
				</div>
			</div>`;

        return html;
    }

    updateTime(timepicker) {
        let timepickerInput = timepicker.parentNode.querySelector('.isjs-timepicker');
        let hourText = timepicker.querySelector('.isjs-hour');
        let minuteText = timepicker.querySelector('.isjs-minute');
        let amBtn = timepicker.querySelector('.isjs-am');
        let pmBtn = timepicker.querySelector('.isjs-pm');

        hourText.innerHTML = this.time.format('hh');
        minuteText.innerHTML = this.time.format('mm');

        timepickerInput.value = this.time.format('hh:mm a');

        if (this.time.format('a') === 'am') {
            toggleActiveState(amBtn, pmBtn);
        } else {
            toggleActiveState(pmBtn, amBtn);
        }

        function toggleActiveState(on, off) {
            on.classList.add('active');
            off.classList.remove('active');
        }
    }

    registerTimepickerActions(timepicker) {
        this.registerHourActions(timepicker);
        this.registerMinuteActions(timepicker);
        this.registerAmPmActions(timepicker);
    }

    registerHourActions(timepicker) {
        // hours
        let hourUpBtn = timepicker.querySelector('.isjs-hour-up');
        let hourDownBtn = timepicker.querySelector('.isjs-hour-down');

        hourUpBtn.addEventListener('click', () => {
            this.time.add(1, 'hours');
            this.updateTime(timepicker);
        });

        hourDownBtn.addEventListener('click', () => {
            this.time.subtract(1, 'hours');
            this.updateTime(timepicker);
        });
    }

    registerMinuteActions(timepicker) {
        // minutes
        let minuteUpBtn = timepicker.querySelector('.isjs-minute-up');
        let minuteDownBtn = timepicker.querySelector('.isjs-minute-down');

        minuteUpBtn.addEventListener('click', () => {
            this.time.add(1, 'minutes');
            this.updateTime(timepicker);
        });

        minuteDownBtn.addEventListener('click', () => {
            this.time.subtract(1, 'minutes');
            this.updateTime(timepicker);
        });
    }

    registerAmPmActions(timepicker) {
        // ampm
        let amBtn = timepicker.querySelector('.isjs-am');
        let pmBtn = timepicker.querySelector('.isjs-pm');

        amBtn.addEventListener('click', () => {
            this.time.add(12, 'hours');
            this.updateTime(timepicker);
        });

        pmBtn.addEventListener('click', () => {
            this.time.add(12, 'hours');
            this.updateTime(timepicker);
        });
    }

    showTimepicker(timepickerClock) {
        timepickerClock.classList.remove('hidden');
    }

    hideTimepicker(timepickerClock) {
        timepickerClock.classList.add('hidden');
    }
}

// Instantiate
((doc) => {
    let timepickers = doc.querySelectorAll('.isjs-timepicker');
    let options = {
        format: 'YYYY-MM-DD',
        locale: 'en'
    };

    let initTimepicker = (container, index) => {
        let self = new Timepicker(index, options);

        container.innerHTML += self.renderTimepicker();

        // define vars from rendered HTML in the DOM
        let timepickerInput = container.querySelector('.isjs-timepicker');
        let timepickerClock = container.querySelector('.timepicker');

        // hide the timepicker when clicked anywhere on the document
        doc.addEventListener('click', () => {
            self.hideTimepicker(timepickerClock);
        });

        container.addEventListener('click', e => {
            // prevent the bubble from the document click so timepicker is not closed when clicking the container
            e.stopPropagation();

            // show the timepicker
            self.showTimepicker(timepickerClock);
        });

        // open timepicker on focus event
        timepickerInput.addEventListener('focus', () => {
            self.showTimepicker(timepickerClock);
        });

        self.registerTimepickerActions(timepickerClock);
    };

    let index = 0;
    for (let item of timepickers) {
        initTimepicker(item.parentNode, index);
        index++;
    }
})(document);
