export class NoteController {
    constructor(noteView, noteService, noteEditController, noteSortController) {
        this.noteView = noteView;
        this.noteService = noteService;
        this.noteEditController = noteEditController;
        this.noteEditController.withNoteSaveCallback(this.handleSaveNote);
        this.noteSortController = noteSortController;
        this.noteSortController.withNoteSortCallback(this.handleSortNotes);
        this.noteList = document.querySelector('#note-view');
    }

    initialize() {
        this.addEventListeners();
        this.noteView.renderNotes(this.noteService.getNotes());
        this.noteView.enableScroll();
    }

    handleSaveNote = (note) => {
        if (note.id) {
            this.noteService.updateNote(note);
            this.noteView.updateNote(note.id, note);
            return;
        }

        this.noteService.addNote(note);
        this.noteView.createAndAddNote(note);
    }

    handleSortNotes = (sortFunction, direction) => {
        this.noteService.sortNotes(sortFunction, direction);
        this.noteView.renderNotes(this.noteService.getNotes());
    }

    addEventListeners() {
        this.noteList.addEventListener('click', this.handleNoteClick);
    }

    handleNoteClick = (event) => {
        const noteElement = event.target.closest('.note-container');
        if (!noteElement) {
            // Clicked on non-note element.
            return;
        }

        const action = event.target.dataset.action;
        if (!action) {
            // Clicked on note but not on a action button.
            return;
        }

        const noteId = noteElement.dataset.noteId;
        const note = this.noteService.getNoteById(noteId);
        console.log(action, 'note id', noteId);

        if (action === 'edit') {
            this.noteEditController.handleEditNote(note);
        }
        else if (action === 'delete') {
            this.noteService.removeNote(noteId);
            this.noteView.removeNote(noteId);
        }
    }
}