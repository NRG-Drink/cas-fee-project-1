export class NoteView {
    constructor() {
        this.isScrollEnabled = false;
        this.isHighlightEnabled = false;
        this.noteView = document.querySelector('#note-view');
    }

    disableScroll = () => {
        this.isScrollEnabled = false;
    }

    enableScroll = () => {
        this.isScrollEnabled = true;
    }

    enableHighlights = () => {
        this.isHighlightEnabled = true;
    }

    disableHighlights = () => {
        this.isHighlightEnabled = false;
    }

    addNote = (noteElement) => {
        this.noteView.insertAdjacentElement('beforeend', noteElement);
        if (this.isScrollEnabled) {
            noteElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    createAndAddNote = async (note) => {
        const newNoteElement = this.createNoteElement(note);
        this.addNote(newNoteElement);
        await this.setNoteHighlight(note._id, 'note-highlight', 800, 300);
    }

    updateNote = async (noteId, updatedNote) => {
        const noteElement = this.noteView.querySelector(`[data-note-id="${noteId}"]`);
        if (noteElement) {
            const updatedNoteElement = this.createNoteElement(updatedNote);
            noteElement.replaceWith(updatedNoteElement);
            if (this.isScrollEnabled) {
                updatedNoteElement.scrollIntoView({ behavior: 'smooth' });
            }

            await this.setNoteHighlight(noteId, 'note-highlight', 600, 200);
        }
    }

    removeNote = async (noteId) => {
        const noteElement = this.noteView.querySelector(`[data-note-id="${noteId}"]`);
        await this.setNoteHighlight(noteId, 'note-delete', 300, 0);

        if (noteElement) {
            this.noteView.removeChild(noteElement);
        }
    }

    delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    setNoteHighlight = async (noteId, highlightClass, durationMs = 800, startDelayMs = 400) => {
        if (!this.isHighlightEnabled) {
            return;
        }

        const startPromise = this.delay(startDelayMs);
        const noteElement = this.noteView.querySelector(`[data-note-id="${noteId}"]`);
        await startPromise;
        if (noteElement) {
            noteElement.classList.add(highlightClass);
            await this.delay(durationMs);
            noteElement.classList.remove(highlightClass);
        }
    }

    renderNotes = (notes) => {
        this.disableScroll();
        this.disableHighlights();
        this.noteView.innerHTML = ''; // Clear existing notes
        notes.forEach(this.createAndAddNote);
        this.enableScroll();
        this.enableHighlights();
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
        const displayDueDate = new Date(note.dueDate ?? new Date('2000-01-01')).toISOString().split('T')[0];
        return `
            <div class="note note-container" data-note-id="${note._id}">

                <div class="note-checkbox">
                    <input type="checkbox" id="note-${note._id}-checkbox" ${note.completed ? 'checked' : ''} disabled>
                    <label for="note-${note._id}-checkbox">${checkbox}</label>
                </div>

                <details class="note-data" ${note.open ? 'open' : ''}>
                    <summary class="note-header">
                        <div class="note-due-date">${displayDueDate}</div>
                        <div class="note-title">${note.title}</div>
                        <div class="note-importance">${importance}</div>
                    </summary>

                    <div class="note-details">
                        <div class="note-text">${note.content}</div>
                        <button class="btn_delete icon" data-action="delete">🗑️</button>
                        <button class="btn_edit icon" data-action="edit">✏️</button>
                    </div>
                </details>
            </div>`;
    }
}