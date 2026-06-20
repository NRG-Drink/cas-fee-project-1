import { describe, it, expect, beforeEach } from 'vitest';
import { NoteService } from '../../../public/scripts/services/note-service.js';
import { Note } from '../../../public/scripts/models/note.js';

describe('NoteService', () => {
    let newNote;
    let updateNote;
    let noteService;
    let initialNotes;

    beforeEach(() => {
        newNote = new Note(2, 'New Note', 'New Content', new Date('2026-07-10'), 4, false);
        updateNote = new Note(1, 'Updated Note', 'Updated Content', new Date('2026-07-17'), 5, true);
        initialNotes = [
            new Note(1, 'First Note', 'Content 1', new Date('2026-01-01'), 3, true),
            new Note(2, 'Second Note', 'Content 2', new Date(), 5, false),
            new Note(3, 'Third Note', 'Content 3', new Date('2100-01-01'), 1, true),
        ];
        noteService = new NoteService(initialNotes);
    });

    describe('getNoteById', () => {
        it('should return a note when a valid ID is provided', () => {
            const note = noteService.getNoteById(1);
            expect(note).toEqual(initialNotes[0]);
            expect(note.title).toBe('First Note');
        });

        it('should return null when an invalid ID is provided', () => {
            const note = noteService.getNoteById(999);
            expect(note).toBeNull();
        });

        it('should return null when searching in an empty note list', () => {
            const emptyService = new NoteService([]);
            const note = emptyService.getNoteById(1);
            expect(note).toBeNull();
        });

        it('should parse string IDs to numbers', () => {
            const note = noteService.getNoteById('2');
            expect(note).toEqual(initialNotes[1]);
            expect(note.title).toBe('Second Note');
        });

        it('should handle negative IDs', () => {
            const note = noteService.getNoteById(-1);
            expect(note).toBeNull();
        });
    });

    describe('getNotes', () => {
        it('should return all notes sorted by default (by ID ascending)', () => {
            const notes = noteService.getNotes();
            expect(notes).toHaveLength(3);
            expect(notes[0]).toEqual(initialNotes[0]);
            expect(notes[1]).toEqual(initialNotes[1]);
            expect(notes[2]).toEqual(initialNotes[2]);
        });

        it('should return an empty array when there are no notes', () => {
            const emptyService = new NoteService([]);
            const notes = emptyService.getNotes();
            expect(notes).toEqual([]);
        });

        it('should return filtered notes when a filter is applied', () => {
            noteService.filterNotes((note) => note._id > 1);
            const notes = noteService.getNotes();
            expect(notes).toHaveLength(2);
            expect(notes.every(note => note._id > 1)).toBe(true);
        });

        it('should return sorted notes when a custom sort is applied', () => {
            noteService.sortNotes((a, b) => b._id - a._id);
            const notes = noteService.getNotes();
            expect(notes[0]._id).toBe(3);
            expect(notes[1]._id).toBe(2);
            expect(notes[2]._id).toBe(1);
        });

        it('should apply both filter and sort', () => {
            noteService.filterNotes((note) => note._id >= 1);
            noteService.sortNotes((a, b) => b._id - a._id);
            const notes = noteService.getNotes();
            expect(notes).toHaveLength(3);
            expect(notes[0]._id).toBe(3);
            expect(notes[1]._id).toBe(2);
            expect(notes[2]._id).toBe(1);
        });

        it('should return empty array when filter excludes all notes', () => {
            noteService.filterNotes((note) => note._id > 100);
            const notes = noteService.getNotes();
            expect(notes).toEqual([]);
        });
    });

    describe('addNote', () => {
        it('should add a note with an auto-generated ID', () => {
            const addNote = noteService.addNote(newNote);
            expect(addNote._id).toBe(4);
            expect(noteService.notes).toHaveLength(4);
        });

        it('should generate the next ID correctly after deletion', () => {
            noteService.removeNote(3);
            const addNote = noteService.addNote(newNote);
            expect(addNote._id).toBe(4);
        });

        it('should add multiple notes with sequential IDs', () => {
            const addNote1 = noteService.addNote(newNote);
            const addNote2 = noteService.addNote(newNote);
            expect(addNote1._id).toBe(4);
            expect(addNote2._id).toBe(5);
        });

        it('should add a note to an empty list with ID 1', () => {
            const emptyService = new NoteService([]);
            const newNote = new Note(2, 'First Note', 'Content', new Date(), 5, false);
            const addedNote = emptyService.addNote(newNote);
            expect(addedNote._id).toBe(1);
            expect(emptyService.notes).toHaveLength(1);
        });

        it('should preserve other note properties when adding', () => {
            // const newNote = new Note(2, 'Test', 'Test Content', new Date('2024-01-01'), new Date('2024-01-02'), 3, false);
            noteService.addNote(newNote);
            noteService.getNoteById(newNote._id);
            expect(newNote._id).toBe(2); // Original newNote ID should remain unchanged
            expect(newNote.title).toBe('New Note');
            expect(newNote.content).toBe('New Content');
            expect(newNote.dueDate).toEqual(new Date('2026-07-10'));
            expect(newNote.importance).toBe(4);
        });
    });

    describe('updateNote', () => {
        it('should update an existing note', () => {
            noteService.updateNote(updateNote);
            const note = noteService.getNoteById(1);
            expect(note.title).toBe('Updated Note');
            expect(note.content).toBe('Updated Content');
            expect(note.dueDate).toEqual(new Date('2026-07-17'));
            expect(note.importance).toBe(5);
        });

        it('should preserve original properties when updating partial properties', () => {
            const originalNote = noteService.getNoteById(1);
            const originalCreated = originalNote.created;
            const updatedNote = { _id: 1, title: 'New Title' };
            noteService.updateNote(updatedNote);
            const note = noteService.getNoteById(1);
            expect(note.title).toBe('New Title');
            expect(note.created).toBe(originalCreated);
        });

        it('should not add a note if ID does not exist', () => {
            const initialLength = noteService.notes.length;
            const nonExistentNote = { _id: 999, title: 'Ghost Note' };
            noteService.updateNote(nonExistentNote);
            expect(noteService.notes).toHaveLength(initialLength);
        });

        it('should update multiple notes independently', () => {
            noteService.updateNote({ _id: 1, importance: 2 });
            noteService.updateNote({ _id: 2, importance: 3 });
            expect(noteService.getNoteById(1).importance).toBe(2);
            expect(noteService.getNoteById(2).importance).toBe(3);
            expect(noteService.getNoteById(3).importance).toBe(1);
        });

        it('should handle updating all properties of a note', () => {
            const newDate = new Date();
            const updatedNote = {
                _id: 2,
                title: 'Completely New',
                content: 'Completely Different Content',
                created: newDate,
                modified: newDate,
                rating: 0
            };
            noteService.updateNote(updatedNote);
            const note = noteService.getNoteById(2);
            expect(note.title).toBe('Completely New');
            expect(note.content).toBe('Completely Different Content');
            expect(note.rating).toBe(0);
        });
    });

    describe('removeNote', () => {
        it('should remove a note by ID', () => {
            noteService.removeNote(1);
            expect(noteService.notes).toHaveLength(2);
            expect(noteService.getNoteById(1)).toBeNull();
        });

        it('should handle removing a non-existent ID gracefully', () => {
            const initialLength = noteService.notes.length;
            noteService.removeNote(999);
            expect(noteService.notes).toHaveLength(initialLength);
        });

        it('should parse string IDs when removing', () => {
            noteService.removeNote('2');
            expect(noteService.getNoteById(2)).toBeNull();
            expect(noteService.notes).toHaveLength(2);
        });

        it('should remove multiple notes independently', () => {
            noteService.removeNote(1);
            noteService.removeNote(3);
            expect(noteService.notes).toHaveLength(1);
            expect(noteService.getNoteById(2).title).toBe('Second Note');
        });

        it('should result in an empty list when removing all notes', () => {
            noteService.removeNote(1);
            noteService.removeNote(2);
            noteService.removeNote(3);
            expect(noteService.notes).toHaveLength(0);
            expect(noteService.getNotes()).toEqual([]);
        });

        it('should handle removing from an empty list', () => {
            const emptyService = new NoteService([]);
            emptyService.removeNote(1);
            expect(emptyService.notes).toHaveLength(0);
        });
    });

    describe('sortNotes', () => {
        it('should set a custom sort function', () => {
            const customSort = (a, b) => b.title.localeCompare(a.title);
            noteService.sortNotes(customSort);
            const notes = noteService.getNotes();
            expect(notes[0].title).toBe('Third Note');
            expect(notes[1].title).toBe('Second Note');
            expect(notes[2].title).toBe('First Note');
        });

        it('should sort by different properties', () => {
            noteService.sortNotes((a, b) => a.title.localeCompare(b.title));
            const notes = noteService.getNotes();
            expect(notes[0].title).toBe('First Note');
            expect(notes[1].title).toBe('Second Note');
            expect(notes[2].title).toBe('Third Note');
        });

        it('should replace previous sort function', () => {
            noteService.sortNotes((a, b) => b._id - a._id);
            let notes = noteService.getNotes();
            expect(notes[0]._id).toBe(3);

            noteService.sortNotes((a, b) => a._id - b._id);
            notes = noteService.getNotes();
            expect(notes[0]._id).toBe(1);
        });

        it('should work with complex sort logic', () => {
            const complexSort = (a, b) => {
                if (a.importance === b.importance) {
                    return a._id - b._id;
                }
                return b.importance - a.importance;
            };
            noteService.sortNotes(complexSort);
            const notes = noteService.getNotes();
            expect(notes[0].importance).toBe(5);
            expect(notes[1].importance).toBe(3);
            expect(notes[2].importance).toBe(1);
        });

        it('should reset to default sorting when resetFiltersAndSorting is called', () => {
            noteService.sortNotes((a, b) => b.importance - a.importance);
            const notesBeforeReset = noteService.getNotes();
            expect(notesBeforeReset[0]._id).toBe(2);
            expect(notesBeforeReset[1]._id).toBe(1);
            expect(notesBeforeReset[2]._id).toBe(3);

            noteService.resetFiltersAndSorting();
            const notes = noteService.getNotes();
            expect(notes[0]._id).toBe(1);
            expect(notes[1]._id).toBe(2);
            expect(notes[2]._id).toBe(3);
        });
    });

    describe('filterNotes', () => {
        it('should set a custom filter function', () => {
            noteService.filterNotes((note) => note._id > 1);
            const notes = noteService.getNotes();
            expect(notes).toHaveLength(2);
            expect(notes.every(note => note._id > 1)).toBe(true);
        });

        it('should filter by string properties', () => {
            noteService.filterNotes((note) => note.title.includes('Second'));
            const notes = noteService.getNotes();
            expect(notes).toHaveLength(1);
            expect(notes[0].title).toBe('Second Note');
        });

        it('should replace previous filter function', () => {
            noteService.filterNotes((note) => note.importance > 2);
            let notes = noteService.getNotes();
            expect(notes).toHaveLength(2);

            noteService.filterNotes((note) => note.importance > 4);
            notes = noteService.getNotes();
            expect(notes).toHaveLength(1);
        });

        it('should allow filtering that matches no notes', () => {
            noteService.filterNotes((note) => note.rating > 100);
            const notes = noteService.getNotes();
            expect(notes).toHaveLength(0);
        });

        it('should allow filtering that matches all notes', () => {
            noteService.filterNotes((note) => note._id >= 0);
            const notes = noteService.getNotes();
            expect(notes).toHaveLength(3);
        });

        it('should work with complex filter logic', () => {
            noteService.filterNotes((note) => note.importance >= 3 && note.title.includes('Note'));
            const notes = noteService.getNotes();
            expect(notes).toHaveLength(2);
            expect(notes.every(note => note.importance >= 3 && note.title.includes('Note'))).toBe(true);
        });

        it('should reset to default filtering when resetFiltersAndSorting is called', () => {
            noteService.filterNotes((note) => note.importance > 4);
            const notesBeforeReset = noteService.getNotes();
            expect(notesBeforeReset).toHaveLength(1);
            expect(notesBeforeReset[0].importance).toBe(5);

            noteService.resetFiltersAndSorting();
            const notes = noteService.getNotes();
            expect(notes).toHaveLength(3);
        });
    });

    describe('Integration scenarios', () => {
        it('should handle a complete workflow: add, filter, sort, update, remove', () => {
            // Add a note
            noteService.addNote(newNote);
            expect(noteService.notes).toHaveLength(4);
            /*  id 1: importance 3
                id 2: importance 5
                id 3: importance 1
                id 4: importance 4 (newNote) */

            // Filter and sort
            noteService.filterNotes((note) => note.importance >= 3);
            noteService.sortNotes((a, b) => b.importance - a.importance);
            let filtered = noteService.getNotes();
            expect(filtered).toHaveLength(3);
            expect(filtered[0].importance).toBe(5);
            expect(filtered[1].importance).toBe(4);
            expect(filtered[2].importance).toBe(3);
            /*  id 2: importance 5
                id 4: importance 4 (newNote)
                id 1: importance 3 */

            // Update
            noteService.updateNote({ _id: 1, importance: 2 });
            filtered = noteService.getNotes();
            expect(filtered).toHaveLength(2);
            expect(filtered[0]._id).toBe(2);
            expect(filtered[1]._id).toBe(4);
            /*  id 2: importance 5
                id 4: importance 4 (newNote) */

            // Remove
            noteService.removeNote(1);
            expect(noteService.getNoteById(1)).toBeNull();
            /*  id 2: importance 5
                id 3: importance 1
                id 4: importance 4 (newNote) */

            // Reset filters and sorting
            noteService.resetFiltersAndSorting();
            const allNotes = noteService.getNotes();
            expect(allNotes).toHaveLength(3);
            expect(allNotes[0]._id).toBe(2);
            expect(allNotes[1]._id).toBe(3);
            expect(allNotes[2]._id).toBe(4);
        });

        it('should maintain state correctly across multiple operations', () => {
            noteService.addNote(newNote);
            noteService.updateNote({ _id: 2, importance: 5 });
            noteService.filterNotes((note) => note.importance >= 2);

            const notes = noteService.getNotes();
            expect(notes.every(note => note.importance >= 2)).toBe(true);
            expect(noteService.getNoteById(2).importance).toBe(5);
        });
    });
});
