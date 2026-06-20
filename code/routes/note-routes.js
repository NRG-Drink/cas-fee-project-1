import express from 'express';

const router = express.Router();
import { noteController } from '../controllers/note-controller.js';

// TODO: add routes for notes
router.get("/", noteController.test);

export const noteRoutes = router;