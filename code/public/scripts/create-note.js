import { notes } from './note.js';
import { addNote } from './note.js';
import { updateNote } from './note.js';

let editNoteId = null;
const btnCreateNote = document.getElementById('btn_create-note');
const btnCancelNote = document.getElementById('btn_cancel-note');
const btnSaveNote = document.getElementById('btn_save-note');

const noteEditSection = document.getElementById('note-edit');

// Note fields.
const createCheckbox = document.getElementById('edit-note-checkbox');
const createDueDateInput = document.getElementById('edit-note-due-date');
const createTitleInput = document.getElementById('edit-note-title');
const createContentInput = document.getElementById('edit-note-content');

function showCreateNoteForm() {
    noteEditSection.style.display = 'block';
    noteEditSection.scrollIntoView({ behavior: 'smooth' });
}

function hideCreateNoteForm() {
    noteEditSection.style.display = 'none';
    noteEditSection.scrollIntoView({ behavior: 'smooth' });
}

function getRatingValue() {
    const selectedRating = document.querySelector('.star-rating input[name="rating"]:checked');
    return selectedRating ? selectedRating.value : null;
}

export function setupCreateNote(note) {
    editNoteId = note ? note.id : null;
    createCheckbox.checked = note ? note.completed : false;
    createDueDateInput.value = note ? note.dueDate : '';
    createTitleInput.value = note ? note.title : '';
    createContentInput.value = note ? note.content : '';
    const ratingValue = note ? note.importance : null;
    if (ratingValue) {
        const ratingInput = document.querySelector(`.star-rating input[name="rating"][value="${ratingValue}"]`);    
        if (ratingInput) {
            ratingInput.checked = true;
        }
    } else {
        const ratingInputs = document.querySelectorAll('.star-rating input[name="rating"]');
        ratingInputs.forEach(input => input.checked = false);
    }
    showCreateNoteForm();
}

hideCreateNoteForm();

// Add event listeners for the buttons.
btnCreateNote.addEventListener('click', () => {
    setupCreateNote(null);
    showCreateNoteForm();
});

btnCancelNote.addEventListener('click', () => {
    hideCreateNoteForm();
});

btnSaveNote.addEventListener('click', () => {
    const newNote = {
        id: editNoteId ? editNoteId : notes.length + 1, // Use existing ID for edits, or generate new ID for new notes
        createdAt: new Date().toISOString(),
        completed: createCheckbox.checked,
        dueDate: createDueDateInput.value,
        title: createTitleInput.value,
        content: createContentInput.value,
        importance: getRatingValue(),
        open: editNoteId,
    };

    if (editNoteId !== null) {
        updateNote(editNoteId, newNote);
    } else {
        addNote(newNote);
    }

    hideCreateNoteForm();
});