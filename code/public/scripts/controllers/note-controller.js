export class NoteController {
    constructor(
        noteView,
        noteService,
        noteEditController,
        noteFilterController,
        noteSortController) {
        this.noteView = noteView;
        this.noteService = noteService;
        this.noteEditController = noteEditController;
        this.noteEditController.withNoteSaveCallback(this.handleSaveNote);
        this.noteFilterController = noteFilterController;
        this.noteFilterController.withNoteFilterCallback(this.handleFilterNotes);
        this.noteSortController = noteSortController;
        this.noteSortController.withNoteSortCallback(this.handleSortNotes);
        this.noteList = document.querySelector('#note-view');
    }

    initialize = async () => {
        this.addEventListeners();
        this.noteView.renderNotes(await this.noteService.getNotes());
        this.noteView.enableScroll();
        this.noteView.enableHighlights();
    }

    handleSaveNote = async (note) => {
        if (note._id) {
            await this.noteService.updateNote(note);
            this.noteView.updateNote(note._id, note);
            return;
        }

        const newNote = await this.noteService.addNote(note);
        this.noteView.createAndAddNote(newNote);
    }

    handleFilterNotes = async (filterFunction) => {
        this.noteService.filterNotes(filterFunction);
        const notes = await this.noteService.getNotes();
        this.noteView.renderNotes(notes);
    }

    handleSortNotes = async (sortFunction) => {
        this.noteService.sortNotes(sortFunction);
        const notes = await this.noteService.getNotes();
        this.noteView.renderNotes(notes);
    }

    addEventListeners() {
        this.noteList.addEventListener('click', async (e) => this.handleNoteClick(e));
    }

    handleNoteClick = async (event) => {
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
        console.log(action, 'note id', noteId);
        
        if (action === 'edit') {
            const note = await this.noteService.getNoteById(noteId);
            console.log('Editing note:', note);
            await this.noteEditController.handleEditNote(note);
        }
        else if (action === 'delete') {
            try {
                await this.noteService.removeNote(noteId);
                await this.noteView.removeNote(noteId);
            } catch (error) {
                console.error('Error deleting note:', error);
            }
        }
    }
}