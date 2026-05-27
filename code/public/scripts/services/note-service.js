import { Note } from '../models/note.js';

export class NoteService {
    constructor(initialNotes = []) {
        this.notes = initialNotes;
    }

    getNoteById(noteId) {
        const id = parseInt(noteId, 10);
        return this.notes.find(note => note.id === id);
    }

    getNotes() {
        return this.notes;
    }

    addNote(note) {
        note.id = this.notes.length + 1;
        this.notes.push(note);
    }

    updateNote(updatedNote) {
        const index = this.notes.findIndex(note => note.id === updatedNote.id);
        if (index !== -1) {
            this.notes[index] = { ...this.notes[index], ...updatedNote };
        }
    }

    removeNote(noteId) {
        this.notes = this.notes.filter(note => note.id !== noteId);
    }

    sortNotes(sortFunction, direction) {
        if (direction === 'ascending') {
            this.notes.sort(sortFunction);
        } else if (direction === 'descending') {
            this.notes.sort((a, b) => sortFunction(b, a));
        } else {
            // Default sorting (by ID or creation order).
            this.notes.sort((a, b) => a.id - b.id);
        }
    }
}
