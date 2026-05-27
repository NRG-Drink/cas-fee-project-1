import { Sort } from '../models/sort.js';

export class SortService {
    constructor(sortValues = null) {
        this.sortRegister = new Map();
        this.baseValues = sortValues ?? [
            new Sort('neutral', '⏹️'),
            new Sort('ascending', '️🔼'),
            new Sort('descending', '🔽')
        ];
    }

    registerSort(key, name, startIndex = 0) {
        this.sortRegister.set(key, { index: startIndex, name: name });
    }

    resetSort(key) {
        const entry = this.sortRegister.get(key);
        entry.index = 0;
    }

    resetAllSorts() {
        for (const key of this.sortRegister.keys()) {
            this.resetSort(key);
        }
    }

    setIndex(key, index) {
        const entry = this.sortRegister.get(key);
        entry.index = index % this.baseValues.length;
    }

    getDefaultSortValue(key) {
        const entry = this.sortRegister.get(key);
        return { ...this.baseValues[0], ...entry };
    }

    getCurrentSortValue(key) {
        const entry = this.sortRegister.get(key);
        const sort = this.baseValues[entry.index];
        return { ...sort, ...entry};
    }

    getNextSortValue(key) {
        const entry = this.sortRegister.get(key);
        entry.index = (entry.index + 1) % this.baseValues.length;
        return this.getCurrentSortValue(key);
    }

    getSortFunction(key) {
        switch (key) {
            case 'title':
                return (a, b) => a.title.localeCompare(b.title);
            case 'dueDate':
                return (a, b) => new Date(a.dueDate) - new Date(b.dueDate);
            case 'createdAt':
                return (a, b) => new Date(a.createdAt) - new Date(b.createdAt);
            case 'importance':
                return (a, b) => a.importance - b.importance;
            default:
                return (a, b) => a.id - b.id; // Default sorting (by ID or creation order).
        }
    }
}