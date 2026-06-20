import Datastore from "@seald-io/nedb";
import { Note } from "../public/scripts/models/note.js";
import { CONFIG } from "../config.js";

export class NoteController {
    constructor() {
        // Initialize NeDB database with file persistence
        this.db = new Datastore({
            filename: CONFIG.data("notes.db"),
            autoload: true
        });
    }

    seed = async () => {
        const notes = [
            new Note(1, "AAA", "KKK", new Date('2026-06-01'), 1, false),
            new Note(2, "BBB", "XXX", new Date('2026-06-02'), 2, true),
            new Note(3, "CCC", "ZZZ", new Date('2026-06-03'), 3, false),
            new Note(4, "DDD", "YYY", new Date('2026-06-04'), 4, true),
        ];

        for (const note of notes) {
            await this.db.insertAsync(note);
        }
    }

    getAllNotes = async (req, res) => {
        try {
            // Filter by request parameters if provided
            let filter = {};
            const isCompleted = req.query.completed === 'true' 
                ? true 
                : req.query.completed === 'false' 
                    ? false 
                    : null;
            if (isCompleted !== null) {
                filter = { 'completed': isCompleted };
            }

            // Sort by request query parameters if provided, otherwise default to sorting by title
            const sortField = req.query.sortBy || 'title';
            const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

            const notes = await this.db
                .findAsync(filter)
                .sort({ [sortField]: sortOrder });
            res.json(notes);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving notes", error: error.message });
        }
    }

    getNoteById = async (req, res) => {
        try {
            const noteId = req.params.id;
            const note = await this.db.findOneAsync({ _id: noteId });
            if (note) {
                res.json(note);
            } else {
                res.status(404).json({ message: "Note not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error retrieving note", error: error.message });
        }
    }

    addNote = async (req, res) => {
        try {
            const { title, content } = req.body;
            const newNote = { title, content };
            
            const insertedNote = await this.db.insertAsync(newNote);
            res.status(201).json(insertedNote);
        } catch (error) {
            res.status(500).json({ message: "Error creating note", error: error.message });
        }
    }

    updateNote = async (req, res) => {
        try {
            const noteId = req.params.id;
            const { title, content } = req.body;
            
            const updatedNote = await this.db.updateAsync(
                { _id: noteId },
                { $set: { title, content } }
            );
            
            if (updatedNote === 0) {
                res.status(404).json({ message: "Note not found" });
                return;
            }
            
            // Retrieve the updated note to return it
            const note = await this.db.findOneAsync({ _id: noteId });
            res.json(note);
        } catch (error) {
            res.status(500).json({ message: "Error updating note", error: error.message });
        }
    }

    deleteNote = async (req, res) => {
        try {
            const noteId = req.params.id;
            
            const deletedCount = await this.db.removeAsync({ _id: noteId });
            
            if (deletedCount === 0) {
                res.status(404).json({ message: "Note not found" });
                return;
            }
            
            res.status(200).send();
        } catch (error) {
            res.status(500).json({ message: "Error deleting note", error: error.message });
        }
    }
}

const noteController = new NoteController();
// noteController.seed(); // Seed the database with initial notes
export { noteController };