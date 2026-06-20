import express from 'express';

import { indexRoutes } from './routes/index-routes.js';
import { noteRoutes } from './routes/note-routes.js';
import { CONFIG } from './config.js';

export const app = express();

app.use(express.static(CONFIG.public));
app.use(express.json());
    
app.use("/", indexRoutes);
app.use("/notes", noteRoutes);

app.use(function (err, req, res, next) {
    console.error(err.stack);
    next(err);
});