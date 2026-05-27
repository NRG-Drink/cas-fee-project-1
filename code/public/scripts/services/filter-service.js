import { ValueIcon } from "../models/value-icon.js";

export class FilterService {
    constructor(filterValues = null) {
        this.register = new Map();
        this.baseValues = filterValues ?? [
            new ValueIcon('unfiltered', '️🔹'),
            new ValueIcon('filtered', '️✅'),
            new ValueIcon('filter-reversed', '️❗'),
        ];
    }

    registerFilter = (key, name, startIndex = 0) => {
        this.register.set(key, { index: startIndex, name: name });
    }

    resetFilter = (key) => {
        this.setIndex(key, 0);
    }

    resetAllFilters = () => {
        for (const key of this.register.keys()) {
            this.resetFilter(key);
        }
    }

    setIndex = (key, index) => {
        const entry = this.register.get(key);
        entry.index = index % this.baseValues.length;
    }

    getDefaultFilterValue = (key) => {
        const entry = this.register.get(key);
        return { ...this.baseValues[0], ...entry };
    }

    getCurrentFilterValue = (key) => {
        const entry = this.register.get(key);
        const filter = this.baseValues[entry.index];
        return { ...filter, ...entry };
    }

    getNextFilterValue = (key) => {
        const entry = this.register.get(key);
        entry.index = (entry.index + 1) % this.baseValues.length;
        return this.getCurrentFilterValue(key);
    }

    getFilterFunction = (key, direction) => {
        const entry = this.getCurrentFilterValue(key);
        if (entry.value === 'unfiltered') {
            return (e) => true;
        }

        let filterFunction;
        if (key === 'isCompleted') {
            filterFunction = (note) => note.completed;
        } else if (key === 'isOverdue') {
            filterFunction = (note) => new Date(note.dueDate) < new Date();
        } else {
            filterFunction = (e) => true; // No filtering by default.
        }

        return direction === 'filter-reversed'
            ? (e) => !filterFunction(e)
            : filterFunction;
    }
}