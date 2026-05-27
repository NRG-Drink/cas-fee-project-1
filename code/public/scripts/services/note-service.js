import { Note } from '../models/note.js';

export class NoteService {
    constructor(initialNotes = []) {
        this.notes = initialNotes;
        this.sortFunction = (a, b) => a.id - b.id;
        this.filterFunction = (e) => true;
    }

    getNoteById = (noteId) => {
        const id = parseInt(noteId, 10);
        return this.notes.find(note => note.id === id);
    }

    getNotes = () => {
        return this.notes
            .filter(this.filterFunction)
            .sort(this.sortFunction);
    }

    addNote = (note) => {
        note.id = this.notes.length + 1;
        this.notes.push(note);
    }

    updateNote = (updatedNote) => {
        const index = this.notes.findIndex(note => note.id === updatedNote.id);
        if (index !== -1) {
            this.notes[index] = { ...this.notes[index], ...updatedNote };
        }
    }

    removeNote = (noteId) => {
        this.notes = this.notes.filter(note => note.id !== noteId);
    }

    sortNotes = (sortFunction, direction) => {
        this.sortFunction = sortFunction;
    }

    filterNotes = (filterFunction) => {
        this.filterFunction = filterFunction;
    }
}
