import { describe, it, expect, beforeEach } from 'vitest';
import Datastore from '@seald-io/nedb';
import { NoteController } from '../../../controllers/note-controller.js';
import { Note } from '../../../public/scripts/models/note.js';

// Helper to create a mock res object
function mockRes() {
    const res = {};
    res.statusCode = 200;
    res.body = null;
    res.status = (code) => { res.statusCode = code; return res; };
    res.json = (data) => { res.body = data; return res; };
    return res;
}

// Helper to create a mock req object
function mockReq({ params = {}, query = {}, body = {} } = {}) {
    return { params, query, body };
}

describe('NoteController', () => {
    let controller;

    beforeEach(async () => {
        controller = new NoteController();
        // Replace the file-backed db with an in-memory one
        controller.db = new Datastore();

        const notes = [
            new Note(undefined, 'Banana', 'yellow fruit', new Date('2026-03-01'), 2, false),
            // new Note(undefined, 'Janana', 'jellow fruit', new Date('2026-03-01'), 2, false),
            new Note(undefined, 'Apple',  'red fruit',    new Date('2026-01-01'), 5, true),
            new Note(undefined, 'Cherry', 'small fruit',  new Date('2026-02-01'), 3, true),
        ];
        for (const note of notes) {
            await controller.db.insertAsync(note);
        }
    });

    // ─── getAllNotes ──────────────────────────────────────────────────────────

    describe('getAllNotes', () => {
        it('returns all notes when no filter or sort is given', async () => {
            const req = mockReq();
            const res = mockRes();
            await controller.getAllNotes(req, res);
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(3);
        });

        it('sorts by title ascending by default', async () => {
            const req = mockReq({ query: { sortBy: 'title' } });
            const res = mockRes();
            await controller.getAllNotes(req, res);
            const titles = res.body.map(n => n.title);
            expect(titles).toEqual(['Apple', 'Banana', 'Cherry']);
        });

        it('sorts by title descending', async () => {
            const req = mockReq({ query: { sortBy: 'title', sortOrder: 'desc' } });
            const res = mockRes();
            await controller.getAllNotes(req, res);
            const titles = res.body.map(n => n.title);
            expect(titles).toEqual(['Cherry', 'Banana', 'Apple']);
        });

        it('sorts by importance ascending', async () => {
            const req = mockReq({ query: { sortBy: 'importance', sortOrder: 'asc' } });
            const res = mockRes();
            await controller.getAllNotes(req, res);
            const importances = res.body.map(n => n.importance);
            expect(importances).toEqual([2, 3, 5]);
        });

        it('sorts by importance descending', async () => {
            const req = mockReq({ query: { sortBy: 'importance', sortOrder: 'descending' } });
            const res = mockRes();
            await controller.getAllNotes(req, res);
            const importances = res.body.map(n => n.importance);
            expect(importances).toEqual([5, 3, 2]);
        });

        it('sorts by dueDate ascending', async () => {
            const req = mockReq({ query: { sortBy: 'dueDate', sortOrder: 'asc' } });
            const res = mockRes();
            await controller.getAllNotes(req, res);
            const titles = res.body.map(n => n.title);
            expect(titles).toEqual(['Apple', 'Cherry', 'Banana']);
        });

        it('filters by completed=true', async () => {
            const req = mockReq({ query: { filter: "'completed''true'" } });
            const res = mockRes();
            await controller.getAllNotes(req, res);
            expect(res.body).toHaveLength(2);
            expect(res.body.every(n => n.completed === true)).toBe(true);
        });

        it('filters by completed=false', async () => {
            const req = mockReq({ query: { filter: "('completed''false')" } });
            const res = mockRes();
            await controller.getAllNotes(req, res);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].completed).toBe(false);
        });

        it('filters by importance>4', async () => {
            const req = mockReq({ query: { filter: "('importance'$gt'4')" } });
            const res = mockRes();
            await controller.getAllNotes(req, res);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].importance).toBeGreaterThan(4);
        });

        it('filters by completed=false and importance<=3', async () => {
            // const xreq = mockReq();
            // const xres = mockRes();
            // const x = await controller.getAllNotes(xreq, xres);
            // const req = mockReq({ query: { filter: "('completed''true')" } });
            const req = mockReq({ query: { filter: "('completed''false'),('importance'$lt'3')" } });
            // const req = mockReq({ query: { filter: "('completed''true'),('importance'$gte'3')" } });
            const res = mockRes();
            await controller.getAllNotes(req, res);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].completed).toBe(false);
            expect(res.body[0].importance).toBeLessThan(3);
        });

        it('filters and sorts together', async () => {
            const req = mockReq({ query: { filter: "'completed''true'", sortBy: 'importance', sortOrder: 'desc' } });
            const res = mockRes();
            await controller.getAllNotes(req, res);
            const importances = res.body.map(n => n.importance);
            expect(importances).toEqual([5, 3]);
        });

        it('returns empty array when filter matches nothing', async () => {
            const req = mockReq({ query: { filter: "'title''Nonexistent'" } });
            const res = mockRes();
            await controller.getAllNotes(req, res);
            expect(res.body).toHaveLength(0);
        });
    });

    // ─── parseFilterQuery ─────────────────────────────────────────────────────

    describe('parseFilterQuery', () => {
        it('returns empty object for undefined input', () => {
            expect(controller.parseFilterQuery(undefined)).toEqual({});
        });

        it('parses a simple equality filter', () => {
            const result = controller.parseFilterQuery("'title''Apple'");
            expect(result).toEqual({ title: 'Apple' });
        });

        it('parses boolean true', () => {
            const result = controller.parseFilterQuery("'completed''true'");
            expect(result).toEqual({ completed: true });
        });

        it('parses boolean false', () => {
            const result = controller.parseFilterQuery("'completed''false'");
            expect(result).toEqual({ completed: false });
        });

        it('parses a filter with an operator', () => {
            const result = controller.parseFilterQuery("'importance'$gte'3'");
            expect(result).toEqual({ importance: { $gte: 3 } });
        });

        it('parses a multiple', () => {
            const result = controller.parseFilterQuery("('completed''false'),('importance'$lt'3')");
            expect(result).toEqual({ completed: false, importance: { $lt: 3 } });
        });
    });

    // ─── getNoteById ──────────────────────────────────────────────────────────

    describe('getNoteById', () => {
        it('returns 404 for a non-existent id', async () => {
            const req = mockReq({ params: { id: 'nonexistent' } });
            const res = mockRes();
            await controller.getNoteById(req, res);
            expect(res.statusCode).toBe(404);
        });

        it('returns the note for a valid id', async () => {
            // First get all notes to find a real id
            const allRes = mockRes();
            await controller.getAllNotes(mockReq(), allRes);
            const id = allRes.body[0]._id;

            const req = mockReq({ params: { id } });
            const res = mockRes();
            await controller.getNoteById(req, res);
            expect(res.statusCode).toBe(200);
            expect(res.body._id).toBe(id);
        });
    });

    // ─── addNote ──────────────────────────────────────────────────────────────

    describe('addNote', () => {
        it('inserts a new note and returns 201', async () => {
            const newNote = { title: 'New', content: 'Content', importance: 1, completed: false };
            const req = mockReq({ body: { ...newNote } });
            const res = mockRes();
            await controller.addNote(req, res);
            expect(res.statusCode).toBe(201);
            expect(res.body.title).toBe('New');
            expect(res.body._id).toBeDefined();
        });

        it('ignores client-provided _id', async () => {
            const req = mockReq({ body: { _id: 'client-id', title: 'Test' } });
            const res = mockRes();
            await controller.addNote(req, res);
            expect(res.body._id).not.toBe('client-id');
        });

        it('increases total note count by 1', async () => {
            const req = mockReq({ body: { title: 'Extra', importance: 1 } });
            const res = mockRes();
            await controller.addNote(req, res);

            const allRes = mockRes();
            await controller.getAllNotes(mockReq(), allRes);
            expect(allRes.body).toHaveLength(4);
        });
    });

    // ─── updateNote ───────────────────────────────────────────────────────────

    describe('updateNote', () => {
        it('updates fields and returns the updated note', async () => {
            const allRes = mockRes();
            await controller.getAllNotes(mockReq(), allRes);
            const id = allRes.body[0]._id;

            const req = mockReq({ params: { id }, body: { title: 'Updated', _id: id } });
            const res = mockRes();
            await controller.updateNote(req, res);
            expect(res.statusCode).toBe(200);
            expect(res.body.title).toBe('Updated');
        });

        it('returns 404 for a non-existent id', async () => {
            const req = mockReq({ params: { id: 'ghost' }, body: { title: 'X' } });
            const res = mockRes();
            await controller.updateNote(req, res);
            expect(res.statusCode).toBe(404);
        });
    });

    // ─── deleteNote ───────────────────────────────────────────────────────────

    describe('deleteNote', () => {
        it('deletes an existing note and returns 200', async () => {
            const allRes = mockRes();
            await controller.getAllNotes(mockReq(), allRes);
            const id = allRes.body[0]._id;

            const req = mockReq({ params: { id } });
            const res = mockRes();
            await controller.deleteNote(req, res);
            expect(res.statusCode).toBe(200);

            const afterRes = mockRes();
            await controller.getAllNotes(mockReq(), afterRes);
            expect(afterRes.body).toHaveLength(2);
        });

        it('returns 404 for a non-existent id', async () => {
            const req = mockReq({ params: { id: 'ghost' } });
            const res = mockRes();
            await controller.deleteNote(req, res);
            expect(res.statusCode).toBe(404);
        });
    });
});
