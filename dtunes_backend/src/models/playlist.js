import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    desc: {
        type: String,
        required: true,
    },
    bgColor: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
})

// const playlistModel = mongoose.models.Playlist || mongoose.model('Playlist', playlistSchema);
const playlistModel = mongoose.model('Playlist', playlistSchema, 'playlists');

export default playlistModel;