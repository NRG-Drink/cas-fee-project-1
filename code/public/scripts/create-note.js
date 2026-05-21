import { notes } from './note.js';
import { renderNotes } from './note.js';

const btnCreateNote = document.getElementById('btn_create-note');
const btnCancelNote = document.getElementById('btn_cancel-note');
const btnSaveNote = document.getElementById('btn_save-note');

const noteEditSection = document.getElementById('note-edit');

// Note fields.
const createCheckbox = document.getElementById('edit-note-checkbox');
const createDueDateInput = document.getElementById('edit-note-due-date');
const createTitleInput = document.getElementById('edit-note-title');
const createContentInput = document.getElementById('edit-note-content');
// const createRatingInput = document.getElementById('edit-note-rating');
    
function showCreateNoteForm() {
    noteEditSection.style.display = 'block';
}

function hideCreateNoteForm() {
    noteEditSection.style.display = 'none';
}

function getRatingValue() {
    const selectedRating = document.querySelector('.star-rating input[name="rating"]:checked');
    return selectedRating ? selectedRating.value : null;
}

hideCreateNoteForm();

// Add event listeners for the buttons.
btnCreateNote.addEventListener('click', () => showCreateNoteForm());

btnCancelNote.addEventListener('click', () => {
    console.log('Cancel Note button clicked');
    hideCreateNoteForm();
});

btnSaveNote.addEventListener('click', () => {
    console.log('Save Note button clicked');
    const newNote = {
        id: notes.length + 1, // Simple ID generation based on current notes count
        createdAt: new Date().toISOString(),
        completed: createCheckbox.checked,
        dueDate: createDueDateInput.value,
        title: createTitleInput.value,
        content: createContentInput.value,
        importance: getRatingValue(),
        open: true,
    };

    console.log('New Note Data:', newNote);
    notes.push(newNote);
    hideCreateNoteForm();
    renderNotes();
});