export class NoteController {
    db = [
        {
            id: 1,
            title: "Sample Note",
            content: "This is a sample note."
        },
        {
            id: 2,
            title: "Another Note",
            content: "This is another note."
        }
    ];

    getAllNotes = async (req, res) => {
        res.json(this.db);
    }

    getNoteById = async (req, res) => {
        const noteId = parseInt(req.params.id);
        const note = this.db.find(n => n.id === noteId);
        if (note) {
            res.json(note);
        } else {
            res.status(404).json({ message: "Note not found" });
        }
    }

    addNote = async (req, res) => {
        const { title, content } = req.body;
        const newNote = {
            id: this.db.length + 1,
            title,
            content
        };
        this.db.push(newNote);
        res.status(201).json(newNote);
    }

    updateNote = async (req, res) => {
        const noteId = parseInt(req.params.id);
        const { title, content } = req.body;
        const noteIndex = this.db.findIndex(n => n.id === noteId);
        if (noteIndex === -1) {
            res.status(404).json({ message: "Note not found" });
            return;
        }

        this.db[noteIndex] = { id: noteId, title, content };
        res.json(this.db[noteIndex]);
    }

    deleteNote = async (req, res) => {
        const noteId = parseInt(req.params.id);
        const noteIndex = this.db.findIndex(n => n.id === noteId);
        if (noteIndex === -1) {
            res.status(404).json({ message: "Note not found" });
            return;
        }

        this.db.splice(noteIndex, 1);
        res.status(200).send();
    }
}

export const noteController = new NoteController();