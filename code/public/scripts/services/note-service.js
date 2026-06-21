export class NoteService {
    constructor(initialNotes = []) {
        this.notes = initialNotes;
        this.maxId = this.notes.length > 0 
            ? Math.max(...this.notes.map(note => note._id)) 
            : 0;
        this.resetFiltersAndSorting();
    }

    /**
     * @param {number} noteId - The ID of the note to be retrieved.
     * @returns {Note|null} - The note with the specified ID, or null if not found.
     */
    getNoteById = (noteId) => {
        const id = parseInt(noteId, 10);
        return this.notes.find(note => note._id === id) || null;
    }

    /**
     * @returns {Note[]} - The list of notes, filtered and sorted.
     */
    getNotes = () => {
        return this.notes
            .filter(this.filterFunction)
            .sort(this.sortFunction);
    }

    /**
     * @param {Note} note - The note to be added. The ID will be generated automatically.
     */
    addNote = (note) => {
        const addNote = { ...note };
        addNote._id = ++this.maxId; // Generate unique ID based on existing notes
        this.notes.push(addNote);
        return addNote;
    }

    /**
     * @param {Note} updatedNote - The note with updated properties. The ID must match an existing note.
     */
    updateNote = (updatedNote) => {
        const index = this.notes.findIndex(note => note._id === updatedNote._id);
        if (index !== -1) {
            this.notes[index] = { ...this.notes[index], ...updatedNote };
        }
    }

    /**
     * @param {number} noteId - The ID of the note to be removed.
     */
    removeNote = (noteId) => {
        this.notes = this.notes.filter(note => note._id !== parseInt(noteId, 10));
    }

    /**
     * @param {function} sortFunction - The function to sort the notes.
     */
    sortNotes = (sortFunction) => {
        this.sortFunction = sortFunction;
    }

    /**
     * @param {function} filterFunction - The function to filter the notes.
     */
    filterNotes = (filterFunction) => {
        this.filterFunction = filterFunction;
    }

    /**
     * Resets the filters and sorting to their default states (no filtering, sorting by ID).
     */
    resetFiltersAndSorting = () => {
        this.resetSorting();
        this.resetFiltering();
    }

    /**
     * Resets the sorting to the default state (sorting by ID).
     */
    resetSorting = () => {
        this.sortFunction = (a, b) => a._id - b._id;
    }

    /**
     * Resets the filtering to the default state (no filtering).
     */
    resetFiltering = () => {
        this.filterFunction = () => true;
    }
}
