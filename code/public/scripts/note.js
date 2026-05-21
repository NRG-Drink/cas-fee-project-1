import { setupCreateNote } from './create-note.js';

const notesView = document.querySelector('#note-view');
export const notes = []; // This will hold our notes data, initially empty.
export const testNotes = [
    {
        id: 1,
        createdAt: '2024-06-01T10:00:00Z',
        completed: false,
        dueDate: '2024-06-10',
        title: 'Buy groceries',
        content: 'Milk, Bread, Eggs, Butter',
        importance: 3,
        open: true,
    },
    {
        id: 2,
        createdAt: '2024-06-02T12:00:00Z',
        completed: true,
        dueDate: '2024-06-05',
        title: 'Finish project report',
        content: 'Complete the final report for the project and submit it by the deadline.',
        importance: 5,
        open: false,
    },
    {
        id: 3,
        createdAt: '2024-06-03T14:00:00Z',
        completed: false,
        dueDate: '2024-06-15',
        title: 'Plan weekend trip',
        content: 'Research destinations, book accommodations, and plan activities for the weekend trip.',
        importance: 2,
        open: true,
    },
    {
        id: 4,
        createdAt: '2024-06-04T16:00:00Z',
        completed: false,
        dueDate: '2024-06-20',
        title: 'Read new book',
        content: 'Start reading the new book that was recommended by a friend.',
        importance: 1,
        open: true,
    },
    {
        id: 5,
        createdAt: '2024-06-05T18:00:00Z',
        completed: true,
        dueDate: '2024-06-08',
        title: 'Call plumber',
        content: 'Schedule an appointment with the plumber to fix the leaking sink in the kitchen.',
        importance: 4,
        open: true,
    },
    {
        id: 6,
        createdAt: '2024-06-06T20:00:00Z',
        completed: false,
        dueDate: '2024-06-25',
        title: 'Organize garage',
        content: 'Clean and organize the garage, sort out old items for donation or disposal.',
        importance: 3,
        open: true,
    }
];

notes.push(...testNotes); // Add test notes to the main notes array.
window.__notes = notes; // Expose notes to the global scope for debugging purposes.

function createNoteCheckbox(id, isChecked) {
    const noteCheckbox = document.createElement('div');
    noteCheckbox.classList.add('note-checkbox');

    const checkboxInput = document.createElement('input');
    checkboxInput.id = id;
    checkboxInput.type = 'checkbox';
    checkboxInput.checked = isChecked;
    checkboxInput.disabled = true;

    const checkboxLabel = document.createElement('label');
    checkboxLabel.htmlFor = id;

    if (isChecked) {
        const imgChecked = document.createElement('img');
        imgChecked.classList.add('checked-img');
        imgChecked.src = './images/components/checkbox-checked.png';
        imgChecked.alt = 'checked';
        checkboxLabel.appendChild(imgChecked);
    } else {
        const imgUnchecked = document.createElement('img');
        imgUnchecked.classList.add('unchecked-img');
        imgUnchecked.src = './images/components/checkbox-unchecked.png';
        imgUnchecked.alt = 'unchecked';
        checkboxLabel.appendChild(imgUnchecked);
    }

    noteCheckbox.appendChild(checkboxInput);
    noteCheckbox.appendChild(checkboxLabel);
    return noteCheckbox;
}

function createNoteElement(note) {
    const df = document.createDocumentFragment();

    const noteContainer = document.createElement('div');
    noteContainer.classList.add('note', 'note-container');
    noteContainer.dataset.noteId = note.id;

    const checkbox = createNoteCheckbox(`note-${note.id}-checkbox`, note.completed);

    const noteElement = document.createElement('details');
    noteElement.classList.add('note-data');
    if (note.open) {
        noteElement.open = true;
    }

    const summaryElement = document.createElement('summary');
    summaryElement.classList.add('note-header');

    const dueDateElement = document.createElement('div');
    dueDateElement.classList.add('note-due-date');
    dueDateElement.textContent = note.dueDate;

    const titleElement = document.createElement('div');
    titleElement.classList.add('note-title');
    titleElement.textContent = note.title;

    const ratingElement = document.createElement('div');
    ratingElement.classList.add('note-importance');
    ratingElement.textContent = note.importance ? '🔥'.repeat(note.importance) : '';


    const contentElement = document.createElement('div');
    contentElement.classList.add('note-details');

    const textElement = document.createElement('div');
    textElement.classList.add('note-text');
    textElement.textContent = note.content;
    contentElement.appendChild(textElement);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn_delete-note', 'icon');
    deleteButton.textContent = '🗑️';
    deleteButton.addEventListener('click', () => {
        removeNote(note.id);
    });

    const editButton = document.createElement('button');
    editButton.classList.add('btn_edit-note', 'icon');
    editButton.textContent = '✏️';
    editButton.addEventListener('click', () => {
        setupCreateNote(note);
    });

    contentElement.appendChild(deleteButton);
    contentElement.appendChild(editButton);

    noteContainer.appendChild(checkbox);
    noteContainer.appendChild(noteElement);
    summaryElement.appendChild(dueDateElement);
    summaryElement.appendChild(titleElement);
    summaryElement.appendChild(ratingElement);
    noteElement.appendChild(summaryElement);
    noteElement.appendChild(contentElement);

    return noteContainer;
}

export function addNote(note) {
    notes.push(note);
    const newNoteElement = createNoteElement(note);
    notesView.insertAdjacentElement('beforeend', newNoteElement);
    newNoteElement.scrollIntoView({ behavior: 'smooth' });
}

export function updateNote(noteId, updatedNote) {
    const noteIndex = notes.findIndex(note => note.id === noteId);
    if (noteIndex !== -1) {
        notes[noteIndex] = { ...notes[noteIndex], ...updatedNote };
        const noteElement = notesView.querySelector(`[data-note-id="${noteId}"]`);
        if (noteElement) {
            const updatedNoteElement = createNoteElement(notes[noteIndex]);
            notesView.replaceChild(updatedNoteElement, noteElement);
            updatedNoteElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

export function removeNote(noteId) {
    const noteIndex = notes.findIndex(note => note.id === noteId);
    if (noteIndex !== -1) {
        notes.splice(noteIndex, 1);
        const noteElement = notesView.querySelector(`[data-note-id="${noteId}"]`);
        if (noteElement) {
            notesView.removeChild(noteElement);
        }
    }

    const noteElement = notesView.querySelector(`[data-note-id="${noteId}"]`);
    if (noteElement) {
        notesView.removeChild(noteElement);
    }
}

function setNoteOpenStates(noteContainers) {
    for (const note of noteContainers) {
        const id = note.dataset.noteId;
        const isOpen = note.querySelector('details').open;
        const noteData = notes.find(n => n.id == id);
        if (noteData) {
            noteData.open = isOpen;
        }
    }
}

export function renderNotes() {
    setNoteOpenStates(notesView.children);
    notesView.innerHTML = ''; // Clear existing notes
    notes.forEach(note => {
        const noteElement = createNoteElement(note);
        notesView.appendChild(noteElement);
    });
}

renderNotes();