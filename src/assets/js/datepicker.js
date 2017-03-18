/* globals moment */
class Datepicker {
    constructor(index, options = {
        format: 'YYYY-MM-DD',
        locale: 'en'
    }) {
        moment.locale(options.locale);

        this.options = options;
        this.now = moment();
        this.time = moment();
        this.selectedMoment = moment();
        this.currentMoment = moment().startOf('month');
        this.dayLabels = this.getDayHeaderData();
        this.selectedDate = '';
        this.hasTimepicker = false;
        this.index = index;
    }

    getYearOptionsData() {
        let options = [];

        if (this.options.yearStart && this.options.yearEnd) {
            let i = 0;
            let diff = (this.options.yearEnd - this.options.yearStart) + 1;

            for (i = 0; i < diff; i++) {
                options.push({
                    label: this.options.yearStart + i,
                    value: this.options.yearStart + i
                });
            }
        } else {
            let thisYear = this.currentMoment.format('YYYY');

            options = [{
                label: +thisYear - 1,
                value: +thisYear - 1
            }, {
                label: +thisYear,
                value: +thisYear
            }, {
                label: +thisYear + 1,
                value: +thisYear + 1
            }];
        }

        return options;
    }

    getDayHeaderData() {
        let ret = [];
        let thisMoment = moment(this.currentMoment).startOf('week');

        for (let i = 0; i < 7; i++) {
            ret.push({
                full: thisMoment.format('dddd'),
                short: thisMoment.format('ddd')
            });

            thisMoment.add(1, 'day');
        }

        return ret;
    }

    getCalendarMonthData(date = this.currentMoment) {
        this.currentMoment = moment(date);

        let now = moment(date);
        let later = moment(date);
        let nextMonth = moment(date).add(1, 'month');
        let startOfDays = moment(date).startOf('week');
        let startOfWeek = now.startOf('week');
        let endOfWeek = later.startOf('week').add(6, 'days');
        let totalWeeks = Math.abs(now.diff(nextMonth, 'weeks'));
        let ret = [];

        for (let i = 0; i <= totalWeeks; i++) {
            ret.push({
                currentMonth: moment(date).format('MMMM'),
                currentYear: moment(date).format('YYYY'),
                startMonth: startOfWeek.format('M'),
                startYear: startOfWeek.format('YYYY'),
                startDay: startOfWeek.format('D'),
                endDay: endOfWeek.format('D'),
                endMonth: endOfWeek.format('M'),
                endYear: endOfWeek.format('YYYY'),
                days: this.getWeekDays(moment(date), moment(), startOfDays)
            });

            startOfWeek.add(7, 'days');
            endOfWeek.add(7, 'days');
        }

        return ret;
    }

    getWeekDays(currentDate, thisMoment, startMoment = moment()) {
        let weekDays = [];

        for (let i = 0; i < 7; i++) {
            weekDays.push({
                label: this.dayLabels[i].full,
                day: +startMoment.format('D'),
                date: startMoment.format(this.options.format),
                isCurrentMonth: startMoment.format('M') === currentDate.format('M'),
                isToday: startMoment.format(this.options.format) === thisMoment.format(this.options.format)
            });
            startMoment = startMoment.add(1, 'day');
        }

        return weekDays;
    }

    // Templating
    renderCalendar() {
        let calendar =
            `<div class="datepicker hidden" aria-hidden="false" id="isjs-datepicker-${this.index}">
                ${this.getCalendarFilterHTML()}
                <table class="calendar" role="grid" aria-labelledby="month" id="isjs-datepicker-table-${this.index}">
                    ${this.getCalendarTheadHTML()}
                    ${this.getCalendarTbodyHTML()}
                </table>
                ${this.getTimeHTML()}
                ${this.getCalendarActionsHTML()}
            </div>`;

        return calendar;
    }

    getCalendarFilterHTML() {
        let filters =
            `<header class="header">
                <h3 class="isjs-datepicker-heading" id="isjs-datepicker-heading-${this.index}">${this.now.format('MMM')} ${this.now.format('D')}, ${this.now.format('YYYY')}</h3>
                <div class="year-container">
                    <label class="sr-only" for="isjs-datepicker-select-year-${this.index}">Pick a Year</label>
                    <div class="select-container">
                        <select class="isjs-year" id="isjs-datepicker-select-year-${this.index}">
                            ${this.renderCalendarFilterOptions()}
                        </select>
                    </div>
                </div>
            </header>
            <div class="month-switcher" id="isjs-datepicker-filters-${this.index}">
                <button class="isjs-datepicker-previous" id="isjs-datepicker-previous-month-${this.index}">
                    <i aria-hidden="true" class="prev-icon"></i>
                    <span class="sr-only">Previous Month</span>
                </button>
                <h3 class="heading" aria-live="assertive" aria-atomic="true">
                    <span class="isjs-month" id="isjs-datepicker-current-month-${this.index}">${this.currentMoment.format('MMMM')}</span>
                    <span class="isjs-year-label" id="isjs-datepicker-current-year-${this.index}">${this.currentMoment.format('YYYY')}</span>
                </h3>
                <button class="isjs-datepicker-next" id="isjs-datepicker-next-month-${this.index}">
                    <span class="sr-only">Next Month</span>
                    <i aria-hidden="true" class="next-icon"></i>
                </button>
            </div>`;

        return filters;
    }

    renderCalendarFilterOptions() {
        let options = this.getYearOptionsData();
        let html = '';

        for (let item of options) {
            html +=
                `<option value="${item.value}"${+this.currentMoment.format('YYYY') === item.value ? 'selected' : ''}>${item.label}</option>`;
        }

        return html;
    }

    getCalendarTheadHTML() {
        let headings = this.getDayHeaderData();
        let html = '';

        for (let item of headings) {
            html +=
                `<th scope="col">
                     <abbr title="${item.full}">${item.short}</abbr>
                </th>`;
        }

        let thead =
            `<thead>
                <tr>
                    ${html}
                </tr>
            </thead>`;

        return thead;
    }

    getCalendarTbodyHTML() {
        let data = this.getCalendarMonthData();
        let html = '';

        for (let item of data) {
            html +=
                `<tr>
                    ${this.renderCalendarTds(item.days)}
                </tr>`;
        }

        let template =
            `<tbody>
                ${html}
            </tbody>`;

        return template;
    }

    getCalendarActionsHTML() {
        let template =
            `<footer class="calendar-footer">
                <button role="button" class="isjs-today calendar-action">Today</button>
                <button role="button" class="isjs-clear calendar-action">Clear</button>
                <button role="button" class="isjs-close calendar-action">Close</button>
            </footer>`;

        return template;
    }

    getTimeHTML() {
        let template = this.hasTimepicker ?
            `<div class="timepicker">
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
			</div>` :
            '';

        return template;
    }

    renderCalendarTds(data) {
        let html = '';

        for (let item of data) {
            html +=
                `<td class="${item.isToday ? 'isjs-is-today' : ''}${item.isCurrentMonth ? ' ' : 'isjs-disabled-text'}" role="gridcell" aria-selected="false" data-date="${item.date}" data-label="${item.label}">
                    <span class="isjs-day" data-date="${item.date}">${item.day}</span>
                </td>`;
        }

        return html;
    }

    // Actions
    renderToday() {
        this.getToday();
        this.renderCalendar();
    }

    renderPreviousMonth() {
        this.getPreviousMonth();
        this.renderCalendar();
    }

    renderNextMonth() {
        this.getNextMonth();
        this.renderCalendar();
    }

    updateCalendar(container) {
        let select = container.querySelector('.isjs-year');

        container.querySelector('.isjs-month').innerHTML = this.currentMoment.format('MMMM');
        container.querySelector('.isjs-year-label').innerHTML = this.currentMoment.format('YYYY');
        container.querySelector('tbody').innerHTML = this.getCalendarTbodyHTML();

        select.value = this.currentMoment.format('YYYY');
    }

    getToday() {
        this.currentMoment = moment().startOf('month');
        return this.getCalendarMonthData();
    }

    getNextMonth() {
        return this.getCalendarMonthData(this.currentMoment.add(1, 'month'));
    }

    getPreviousMonth() {
        return this.getCalendarMonthData(this.currentMoment.subtract(1, 'month'));
    }

    showDatepicker(datepicker) {
        datepicker.classList.remove('hidden');
    }

    hideDatepicker(datepicker) {
        datepicker.classList.add('hidden');
    }

    removeActiveStates(container) {
        let containers = container.querySelectorAll('.isjs-is-selected');

        for (let item of containers) {
            item.classList.remove('isjs-is-selected');
        }
    }

    selectDate(cb) {
        if (typeof cb === 'function') {
            cb();
        }
    }

    updateHeader(dateHeading) {
        // update header
        this.selectedMoment = moment(this.selectedDate);
        dateHeading.innerHTML =
            `${this.selectedMoment.format('MMM')} ${this.selectedMoment.format('D')}, ${this.selectedMoment.format('YYYY')}`;
    }

    updateTime(timepicker) {
        let datepickerInput = timepicker.parentNode.parentNode.querySelector('.isjs-datetimepicker');
        let hourText = timepicker.querySelector('.isjs-hour');
        let minuteText = timepicker.querySelector('.isjs-minute');
        let amBtn = timepicker.querySelector('.isjs-am');
        let pmBtn = timepicker.querySelector('.isjs-pm');

        hourText.innerHTML = this.time.format('hh');
        minuteText.innerHTML = this.time.format('mm');

        datepickerInput.value = this.selectedDate + ' ' + this.time.format('hh:mm a');

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
}

// Instantiate
((doc) => {
    let datepickers = doc.querySelectorAll('.isjs-datepicker, .isjs-datetimepicker');
    let options = {
        format: 'YYYY-MM-DD',
        locale: 'en',
        yearStart: 2000,
        yearEnd: 2020
    };

    let initializeDatepicker = (container, index) => {
        let self = new Datepicker(index, options);

        self.hasTimepicker = container.querySelector('.isjs-datetimepicker');

        // render calendar
        container.innerHTML += self.renderCalendar();

        // the input could have one of two classes: .isjs-datepicker renders a standalone datepicker; .isjs-datetimepicker renders a date and time picker combo.
        let datepickerInput = container.querySelector('.isjs-datepicker') || container.querySelector('.isjs-datetimepicker');

        // now define vars from rendered HTML in the DOM
        let datepickerCalendar = container.querySelector('.datepicker');
        let prevBtn = container.querySelector('.isjs-datepicker-previous');
        let nextBtn = container.querySelector('.isjs-datepicker-next');
        let yearBtn = container.querySelector('.isjs-year');
        let todayBtn = container.querySelector('.isjs-today');
        let dateHeading = container.querySelector('.isjs-datepicker-heading');

        if (self.hasTimepicker) {
            let timepicker = container.querySelector('.timepicker');
            self.registerTimepickerActions(timepicker);
        }

        // add event listeners
        prevBtn.addEventListener('click', () => {
            self.renderPreviousMonth();
            self.updateCalendar(container); // update calendar month, year, and tbody
        });

        nextBtn.addEventListener('click', () => {
            self.renderNextMonth();
            self.updateCalendar(container); // update calendar month, year, and tbody
        });

        yearBtn.addEventListener('change', function () {
            self.currentMoment.year(this.value); // set to selected year
            self.updateCalendar(container); // update calendar month, year, and tbody
        });

        // hide the datepicker when clicked anywhere on the document
        doc.addEventListener('click', () => {
            self.hideDatepicker(datepickerCalendar);
        });

        // delegate events for clicking on days, clear, and close
        container.addEventListener('click', e => {
            // prevent the bubble from the document click so datepicker is not closed when clicking the container
            e.stopPropagation();

            let target = e.target;

            // show the datepicker
            self.showDatepicker(datepickerCalendar);

            // listen for click events on dates which could be triggered from the spans wrapped
            // around the dates or the tds that contain them
            if (e.target.classList.contains('isjs-day')) {
                target = e.target.parentNode;
            }

            // Days on the calendar
            if (e.target.nodeName.toLowerCase() === 'td' || e.target.classList.contains('isjs-day')) {
                // remove current active states
                self.removeActiveStates(container);

                target.classList.add('isjs-is-selected');
                self.selectedDate = target.getAttribute('data-date');

                // update header
                self.updateHeader(dateHeading);

                // update date input with selected date
                datepickerInput.value = self.selectedDate;

                if (self.hasTimepicker) {
                    datepickerInput.value += ' ' + self.time.format('hh:mm a');
                }
            }

            // Clear button
            if (e.target.classList.contains('isjs-clear')) {
                datepickerInput.value = ''; // clear input
            }

            // Close button
            if (e.target.classList.contains('isjs-close')) {
                self.hideDatepicker(datepickerCalendar); // close datepicker
            }
        });

        // open datepicker on focus event
        datepickerInput.addEventListener('focus', () => {
            self.showDatepicker(datepickerCalendar);
        });

        if (todayBtn) {
            todayBtn.addEventListener('click', e => {
                // prevent the bubble from the document click so datepicker is not closed when clicking the container
                e.stopPropagation();

                // update calendar to today and select the date
                self.renderToday();

                // update calendar month, year, and tbody
                self.updateCalendar(container);

                // update date input value with today's date
                self.selectedDate = moment().format(self.options.format);
                datepickerInput.value = self.selectedDate;

                if (self.hasTimepicker) {
                    datepickerInput.value += ' ' + self.time.format('hh:mm a');
                }

                // add active state to this date
                container.querySelector('.isjs-is-today').classList.add('isjs-is-selected');

                // update header
                self.updateHeader(dateHeading);
            });
        }
    };

    let index = 0;
    for (let item of datepickers) {
        initializeDatepicker(item.parentNode, index);
    }
})(document);
