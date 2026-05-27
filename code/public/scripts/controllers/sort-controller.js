import { SortService } from '../services/sort-service.js';
import { ButtonNameIconView } from '../views/button-name-icon-view.js';
import { NoteService } from '../services/note-service.js';

export class SortController {
    constructor(sortService, sortView, noteService) {
        this.sortService = sortService;
        this.sortView = sortView;
        this.noteService = noteService;

        this.container = document.querySelector('#menu');

        this.sortComplete = document.querySelector('#btn_sort-complete');
        this.sortTitle = document.querySelector('#btn_sort-title');
        this.sortDueDate = document.querySelector('#btn_sort-due-date');
        this.sortCreationDate = document.querySelector('#btn_sort-creation-date');
        this.sortImportance = document.querySelector('#btn_sort-importance');
    }

    withNoteSortCallback = (callback) => {
        this.noteSortCallback = callback;
    }

    initialize = () => {
        this.registerToService();
        this.addDataAttributes();
        this.addEventListeners();
        this.setCurrentButtonTexts();
    }

    registerToService = () => {
        this.sortService.registerSort('complete', 'Sort by Complete');
        this.sortService.registerSort('title', 'Sort by Title');
        this.sortService.registerSort('dueDate', 'Sort by Due Date');
        this.sortService.registerSort('createdAt', 'Sort by Creation Date');
        this.sortService.registerSort('importance', 'Sort by Importance');
    }

    addDataAttributes = () => {
        this.sortComplete.dataset.sortKey = 'complete';
        this.sortTitle.dataset.sortKey = 'title';
        this.sortDueDate.dataset.sortKey = 'dueDate';
        this.sortCreationDate.dataset.sortKey = 'createdAt';
        this.sortImportance.dataset.sortKey = 'importance';
    }

    setCurrentButtonTexts = () => {
        this.setCurrentIcon(this.sortComplete, 'complete');
        this.setCurrentIcon(this.sortTitle, 'title');
        this.setCurrentIcon(this.sortDueDate, 'dueDate');
        this.setCurrentIcon(this.sortCreationDate, 'createdAt');
        this.setCurrentIcon(this.sortImportance, 'importance');
    }

    setCurrentIcon = (button, sortKey) => {
        const currentSortValue = this.sortService.getCurrentSortValue(sortKey);
        this.sortView.setButtonText(button, currentSortValue);
        return currentSortValue;
    }

    setNextIcon = (button, sortKey) => {
        const nextSortValue = this.sortService.getNextSortValue(sortKey);
        this.sortView.setButtonText(button, nextSortValue);
        return nextSortValue;
    }

    addEventListeners = () => {
        this.container.addEventListener('click', (e) => {
            if (!e.target.dataset.sortKey) {
                return;
            }

            const sortKey = e.target.dataset.sortKey;
            const nextSortValue = this.setNextIcon(e.target, sortKey);
            const sortFunction = this.sortService.getSortFunction(sortKey);
            this.noteSortCallback(sortFunction);

            this.sortService.resetAllSorts();
            this.sortService.setIndex(sortKey, nextSortValue.index);
            this.setCurrentButtonTexts();
        });
    }
}