import { ValueIcon } from '../models/value-icon.js';

export class SortService {
    constructor(sortValues = null) {
        this.register = new Map();
        this.baseValues = sortValues ?? [
            new ValueIcon('neutral', '🔹'),
            new ValueIcon('ascending', '️🔺'),
            new ValueIcon('descending', '️🔻')
        ];
    }

    registerSort = (key, name, startIndex = 0) => {
        this.register.set(key, { index: startIndex, name: name });
    }

    resetSort = (key) => {
        const entry = this.register.get(key);
        entry.index = 0;
    }

    resetAllSorts = () => {
        for (const key of this.register.keys()) {
            this.resetSort(key);
        }
    }

    setIndex = (key, index) => {
        const entry = this.register.get(key);
        entry.index = index % this.baseValues.length;
    }

    getDefaultSortValue = (key) => {
        const entry = this.register.get(key);
        return { ...this.baseValues[0], ...entry };
    }

    getCurrentSortValue = (key) => {
        const entry = this.register.get(key);
        const sort = this.baseValues[entry.index];
        return { ...sort, ...entry };
    }

    getNextSortValue = (key) => {
        const entry = this.register.get(key);
        entry.index = (entry.index + 1) % this.baseValues.length;
        return this.getCurrentSortValue(key);
    }

    getSortFunction = (key) => {
        const entry = this.getCurrentSortValue(key);
        if (entry.value === 'neutral') {
            return (a, b) => a.id - b.id; // Default sorting (by ID or creation order).
        }

        let sortFunction;
        if (key === 'complete') {
            sortFunction = (a, b) => a.completed - b.completed;
        } else if (key === 'title') {
            sortFunction = (a, b) => a.title.localeCompare(b.title);
        } else if (key === 'dueDate') {
            sortFunction = (a, b) => new Date(a.dueDate) - new Date(b.dueDate);
        } else if (key === 'createdAt') {
            sortFunction = (a, b) => new Date(a.createdAt) - new Date(b.createdAt);
        } else if (key === 'importance') {
            sortFunction = (a, b) => a.importance - b.importance;
        } else {
            sortFunction = (a, b) => a.id - b.id; // Default sorting (by ID or creation order).
        }

        return entry.value === 'descending'
            ? (a, b) => sortFunction(b, a)
            : sortFunction;

        // switch (key) {
        //     case 'title':
        //         return (a, b) => a.title.localeCompare(b.title);
        //     case 'dueDate':
        //         return (a, b) => new Date(a.dueDate) - new Date(b.dueDate);
        //     case 'createdAt':
        //         return (a, b) => new Date(a.createdAt) - new Date(b.createdAt);
        //     case 'importance':
        //         return (a, b) => a.importance - b.importance;
        //     default:
        //         return (a, b) => a.id - b.id; // Default sorting (by ID or creation order).
        // }
    }
}