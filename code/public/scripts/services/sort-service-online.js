import { ValueIcon } from '../models/value-icon.js';

export class SortServiceOnline {
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
            return null; // No sorting, return null or a function that does not change the order.
        }

        return {
            sortBy: key,
            sortOrder: entry.value
        };
    }
}