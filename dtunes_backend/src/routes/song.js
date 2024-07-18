//ROUTES:

import { addDislike, addLike, addSong, listSong, removeSong } from "../controllers/song.js";
import express from 'express'
import upload from '../middleware/multer.js'

const songRouter = express.Router();

songRouter.post('/', upload.fields([
    {
        name: 'image',
        maxCount: 1,
    },
    {
        name: 'audio',
        maxCount: 1,
    },
]), addSong);

songRouter.get('/', listSong);

songRouter.delete('/:id', removeSong);

songRouter.post('/like', addLike);
songRouter.post('/dislike', addDislike);

// songRouter.get('/seed', seedSongLikes);


export default songRouter;