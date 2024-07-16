//ROUTES:

import { addDislike, addLike, addSong, listSong, removeSong } from "../controllers/song.js";
import express from 'express'
import upload from '../middleware/multer.js'

// import multer from "multer";
// import {storage} from '../config/cloudinary.js';
// const upload = multer({dest: 'uploads/'})
// const upload = multer({storage})

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

// songRouter.post('/', upload.array('audio'), (req, res) => {
//     console.log(req.files, req.body, JSON.stringify(req.files), JSON.stringify(req.body));
//     res.send(JSON.stringify(req.files));
// })

songRouter.get('/', listSong);

songRouter.delete('/:id', removeSong);

songRouter.post('/like', addLike);
songRouter.post('/dislike', addDislike);

// songRouter.get('/seed', seedSongLikes);

export default songRouter;