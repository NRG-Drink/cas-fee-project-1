
export const notes = [
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
];

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

    noteContainer.appendChild(checkbox);
    noteContainer.appendChild(noteElement);
    summaryElement.appendChild(dueDateElement);
    summaryElement.appendChild(titleElement);
    summaryElement.appendChild(ratingElement);
    noteElement.appendChild(summaryElement);
    noteElement.appendChild(contentElement);

    return noteContainer;
}

export function renderNotes() {
    const notesView = document.querySelector('#note-view');
    notesView.innerHTML = ''; // Clear existing notes
    notes.forEach(note => {
        const noteElement = createNoteElement(note);
        notesView.appendChild(noteElement);
    });
}

renderNotes();