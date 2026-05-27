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

    renderNotes = (notes, isScrollEnabled = false) => {
        this.disableScroll();
        this.noteView.innerHTML = ''; // Clear existing notes
        notes.forEach(this.createAndAddNote);
        this.enableScroll();
    }

    createNoteElement = (note) => {
        const template = document.createElement('template');
        template.innerHTML = this.createNoteHtml(note).trim();
        const noteElement = template.content.firstChild;
        return noteElement;
    }   
    
    createNoteHtml = (note) => {
        const importance = note.importance > 0
            ? '🔥'.repeat(note.importance)
            : '🧊';
        const checkbox = note.completed
            ? `<img class="checked-img" src="./images/components/checkbox-checked.png" alt="checked">`
            : `<img class="unchecked-img" src="./images/components/checkbox-unchecked.png" alt="unchecked">`;
        return `
            <div class="note note-container" data-note-id="${note.id}">

                <div class="note-checkbox">
                    <input type="checkbox" id="note-${note.id}-checkbox" ${note.completed ? 'checked' : ''}>
                    <label for="note-${note.id}-checkbox">${checkbox}</label>
                </div>

                <details class="note-data" ${note.open ? 'open' : ''}>
                    <summary class="note-header">
                        <div class="note-due-date">${note.dueDate}</div>
                        <div class="note-title">${note.title}</div>
                        <div class="note-importance">${importance}</div>
                    </summary>

                    <div class="note-details">
                        <div class="note-text">${note.content}</div>
                        <button class="btn_delete icon">🗑️</button>
                        <button class="btn_edit icon">✏️</button>
                    </div>
                </details>
            </div>`;
    }
}