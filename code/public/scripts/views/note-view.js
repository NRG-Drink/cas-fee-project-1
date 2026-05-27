export class NoteView {
    constructor() {
        this.isScrollEnabled = false;
        this.noteView = document.querySelector('#note-view');
    }

    disableScroll = (noteElement) => {
        this.isScrollEnabled = false;
    }

    enableScroll = (noteElement) => {
        this.isScrollEnabled = true;
    }

    addNote = (noteElement) => {
        this.noteView.insertAdjacentElement('beforeend', noteElement);
        if (this.isScrollEnabled) {
            noteElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    createAndAddNote = (note) => {
        const newNoteElement = this.createNoteElement(note);
        this.addNote(newNoteElement);
    }

    updateNote = (noteId, updatedNote) => {
        const noteElement = this.noteView.querySelector(`[data-note-id="${noteId}"]`);
        if (noteElement) {
            const updatedNoteElement = this.createNoteElement(updatedNote);
            if (this.isScrollEnabled) {
                noteElement.scrollIntoView({ behavior: 'smooth' });
            }

            noteElement.replaceWith(updatedNoteElement);
        }
    }

    removeNote = (noteId) => {
        const noteElement = this.noteView.querySelector(`[data-note-id="${noteId}"]`);
        if (noteElement) {
            this.noteView.removeChild(noteElement);
        }
    }

    setNoteOpenStates = (noteContainers) => {
        for (const note of noteContainers) {
            const id = note.dataset.noteId;
            const isOpen = note.querySelector('details').open;
        }
    }

    renderNotes = (notes) => {
        this.noteView.innerHTML = ''; // Clear existing notes
        notes.forEach(this.createAndAddNote);
    }

    createNoteElement = (note) => {
        const noteContainer = document.createElement('div');
        noteContainer.classList.add('note', 'note-container');
        noteContainer.dataset.noteId = note.id;

        const checkbox = this.createNoteCheckbox(`note-${note.id}-checkbox`, note.completed);

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
        deleteButton.dataset.action = 'delete';
        deleteButton.classList.add('btn_delete-note', 'icon');
        deleteButton.textContent = '🗑️';

        const editButton = document.createElement('button');
        editButton.dataset.action = 'edit';
        editButton.classList.add('btn_edit-note', 'icon');
        editButton.textContent = '✏️';

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

    createNoteCheckbox = (id, isChecked) => {
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
}