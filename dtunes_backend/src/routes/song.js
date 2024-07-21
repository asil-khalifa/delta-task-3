//ROUTES:

import { addDislike, addLike, addSong, songLyrics, listSong, removeSong } from "../controllers/song.js";
import express from 'express'
import upload from '../middleware/multer.js'
import { authenticateToken } from "../../auth.js";

const songRouter = express.Router();

songRouter.post('/', authenticateToken,
    upload.fields([
        {
            name: 'image',
            maxCount: 1,
        },
        {
            name: 'audio',
            maxCount: 1,
        },]),
    addSong);

songRouter.get('/', listSong);

//lyrics:
songRouter.get('/:id/lyrics', songLyrics);

songRouter.delete('/:id', removeSong);

songRouter.post('/like', authenticateToken, addLike);
songRouter.post('/dislike', authenticateToken, addDislike);

// songRouter.get('/seed', seedSongLyrics);

export default songRouter;