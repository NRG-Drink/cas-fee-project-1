export class NoteController {
    test = async (req, res) => {
        res.end("Hello from the note controller");
    }
}

export const noteController = new NoteController();