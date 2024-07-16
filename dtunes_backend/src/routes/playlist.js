//ROUTES:

import { addPlaylist, addSongToPlaylist, getSongsOfPlaylist, listPlaylist, removePlaylist, removeSongFromPlaylist } from "../controllers/playlist.js";
import express from 'express'
import upload from '../middleware/multer.js'

const playlistRouter = express.Router();

playlistRouter.post('/', upload.single('image'), addPlaylist);

playlistRouter.get('/', listPlaylist);

playlistRouter.delete('/:id', removePlaylist);

//returns both songs in the playlist and those not in the playlist
playlistRouter.get('/:pId/songs', getSongsOfPlaylist)

//to add song, pass in the user id as json
playlistRouter.post('/:playlistId/:songId', addSongToPlaylist);

playlistRouter.delete('/:playlistId/:songId', removeSongFromPlaylist);

// playlistRouter.get('/seed', seedPlaylistSongs);

export default playlistRouter;