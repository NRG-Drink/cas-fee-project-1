import { ValueIcon } from "../models/value-icon.js";

export class FilterServiceOnline {
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
        return { ...filter, ...entry, key };
    }

    getNextFilterValue = (key) => {
        const entry = this.register.get(key);
        entry.index = (entry.index + 1) % this.baseValues.length;
        return this.getCurrentFilterValue(key);
    }

    getFilterFunction = () => {
        let filters = [];
        for (const filterKey of this.register.keys()) {
            const entry = this.getCurrentFilterValue(filterKey);
            const filter = this.getFilterQuery(entry);
            if (filter) {
                filters.push(filter);
            }
        }

        return filters.join('and');
    }

    getFilterQuery = (entry) => {
        if (entry.value === 'unfiltered') {
            return ``; // No filter query.
        }

        if (entry.key === 'isCompleted') {
            const value = entry.value === 'filter-reversed' ? false : true;
            return `('completed''${value}')`;
        } else if (entry.key === 'isOverdue') {
            const operator = entry.value === 'filter-reversed' ? '$gte' : '$lt';
            const value = new Date().toISOString().split('T')[0];
            return `('dueDate'${operator}'${value}')`;
        }

        return '';
    }
}