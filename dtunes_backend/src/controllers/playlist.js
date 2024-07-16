import { v2 as cloudinary } from 'cloudinary';
import playlistModel from '../models/playlist.js'

async function addPlaylist(req, res) {
    const { name, desc, bgColor } = req.body;
    const image = req.file
    // console.log(name, desc, playlist, imageFile.path, audioFile.path);

    try {
        const imageUpload = await cloudinary.uploader.upload(image.path, { resource_type: 'image' })

        // console.log(audioUpload, imageUpload)

        // const duration_m = Math.floor(audioUpload.duration / 60);
        // const duration_s = Math.floor(audioUpload.duration % 60);

        // const duration = `${duration_m}:${duration_s < 10?'0':''}${duration_s}`

        const playlistData = {
            name,
            desc,
            bgColor,
            image: imageUpload.secure_url,
            // duration,
        }

        const playlist = playlistModel(playlistData);
        await playlist.save();
        res.json({ success: true, message: 'playlist added' })

    } catch (e) {
        console.log('Error adding playlist:', e);
        res.json({ success: false, message: e });
    }
}

async function listPlaylist(req, res) {
    try {
        const allPlaylists = await playlistModel.find({});
        res.json({ success: true, message: 'Successful', playlists: allPlaylists })
    } catch (e) {
        res.json({ success: false, message: e })
    }
}

async function removePlaylist(req, res) {
    try {
        const { id } = req.params;
        await playlistModel.findByIdAndDelete(id);
        res.json({ success: true, message: 'Deleted Successfully' })
    } catch (e) {
        res.json({ success: false, message: e });
    }
}

export { addPlaylist, listPlaylist, removePlaylist };
