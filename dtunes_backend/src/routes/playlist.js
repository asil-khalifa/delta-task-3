//ROUTES:

import { addPlaylist, listPlaylist, removePlaylist } from "../controllers/playlist.js";
import express from 'express'
import upload from '../middleware/multer.js'

const playlistRouter = express.Router();

playlistRouter.post('/', upload.single('image'), addPlaylist);

playlistRouter.get('/', listPlaylist);

playlistRouter.delete('/:id', removePlaylist);

export default playlistRouter;