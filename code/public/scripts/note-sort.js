import { notes } from './note.js';
import { renderNotes } from './note.js';

const btnSortTitle = document.querySelector('#btn_sort-title');
const btnSortDueDate = document.querySelector('#btn_sort-due-date');
const btnSortCreatedAt = document.querySelector('#btn_sort-creation-date');
const btnSortImportance = document.querySelector('#btn_sort-importance');

const sortKeys = [
    { key: 'none', icon: '⏹️' },
    { key: 'ascending', icon: '🔼' },
    { key: 'descending', icon: '🔽' },
];

resetSortings();

function resetSortings() {
    setSortKey(btnSortTitle, sortKeys[0]);
    setSortKey(btnSortDueDate, sortKeys[0]);
    setSortKey(btnSortCreatedAt, sortKeys[0]);
    setSortKey(btnSortImportance, sortKeys[0]);
}

function stripIcon(button) {
    const currentText = button.textContent;
    const newText = currentText.replace(/🔼|🔽|⏹️/g, '').trim();
    button.textContent = newText;
}

function toggleSortKey(button) {
    const currentKey = button.dataset.sortKey;
    const currentIndex = sortKeys.findIndex(k => k.key == currentKey);
    const nextIndex = (currentIndex + 1) % sortKeys.length;
    const key = sortKeys[nextIndex];
    return key;
}

function setSortKey(button, key) {
    button.dataset.sortKey = key.key;
    stripIcon(button);
    button.textContent += ` ${key.icon}`;
}

function handleSort(button, compareFunction) {
    const key = toggleSortKey(button);
    resetSortings();
    setSortKey(button, key);
    if (key.key === 'ascending') {
        notes.sort(compareFunction);
    } else if (key.key === 'descending') {
        notes.sort((a, b) => compareFunction(b, a));
    } else {
        // Default sorting (by ID or creation order).
        notes.sort((a, b) => a.id - b.id);
    }

    renderNotes();
}

// Add event listeners for sorting buttons.
btnSortTitle.addEventListener('click', () => {
    handleSort(btnSortTitle, (a, b) => a.title.localeCompare(b.title));
});

btnSortDueDate.addEventListener('click', () => {
    handleSort(btnSortDueDate, (a, b) => new Date(a.dueDate) - new Date(b.dueDate));
});

btnSortCreatedAt.addEventListener('click', () => {
    handleSort(btnSortCreatedAt, (a, b) => new Date(a.createdAt) - new Date(b.createdAt));
});

btnSortImportance.addEventListener('click', () => {
    handleSort(btnSortImportance, (a, b) => a.importance - b.importance);
});
