export class FilterController {
    constructor(filterView, filterService, noteService) {
        this.filterView = filterView;
        this.filterService = filterService;
        this.noteService = noteService;

        this.containter = document.querySelector('#menu-filters');
        this.filterCompleted = document.querySelector('#btn_filter-completed');
        this.filterOverdue = document.querySelector('#btn_filter-overdue');

        this.filterFunctions = new Map();
    }

    withNoteFilterCallback = (callback) => {
        this.noteFilterCallback = callback;
    }

    initialize = () => {
        this.registerFunctionDefaults();
        this.registerToService();
        this.addDataAttributes();
        this.addEventListeners();
        this.setCurrentButtonTexts();
    }

    registerFunctionDefaults = () => {
        this.filterFunctions.set('isCompleted', (e) => true);
        this.filterFunctions.set('isOverdue', (e) => true);
    }

    registerToService = () => {
        this.filterService.registerFilter('isCompleted', 'Filter Completed');
        this.filterService.registerFilter('isOverdue', 'Filter Overdue');
    }

    addDataAttributes = () => {
        this.filterCompleted.dataset.filterKey = 'isCompleted';
        this.filterOverdue.dataset.filterKey = 'isOverdue';
    }

    setCurrentButtonTexts = () => {
        this.setCurrentIcon(this.filterCompleted, 'isCompleted');
        this.setCurrentIcon(this.filterOverdue, 'isOverdue');
    }

    setCurrentIcon = (button, filterKey) => {
        const currentFilterValue = this.filterService.getCurrentFilterValue(filterKey);
        this.filterView.setButtonText(button, currentFilterValue);
        return currentFilterValue;
    }

    setNextIcon = (button, filterKey) => {
        const nextFilterValue = this.filterService.getNextFilterValue(filterKey);
        this.filterView.setButtonText(button, nextFilterValue);
        return nextFilterValue;
    }

    getFilterFunctionCombined = () => {
        let func = (e) => true;
        for (const filterFunction of this.filterFunctions.values()) {
            const prev = func;
            func = (e) => prev(e) && filterFunction(e);
        }

        return func;
    }

    addEventListeners = () => {
        this.containter.addEventListener('click', (e) => {
            if (!e.target.dataset.filterKey) {
                return;
            }

            const filterKey = e.target.dataset.filterKey;
            const nextFilterValue = this.setNextIcon(e.target, filterKey);
            const filterFunction = this.filterService.getFilterFunction(filterKey, nextFilterValue.value);
            this.filterFunctions.set(filterKey, filterFunction);
            if (this.noteFilterCallback) {
                const combinedFilterFunction = this.getFilterFunctionCombined();
                this.noteFilterCallback(combinedFilterFunction);
            }

            this.filterService.setIndex(filterKey, nextFilterValue.index);
            this.setCurrentButtonTexts();
        });
    }
}