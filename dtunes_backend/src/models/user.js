import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    playlists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Playlist'
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    isArtist: {
        type: Boolean,
        required: true,
    },
    profileColor: {
        type: String,
        required: true,
    },
    likedSongs:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
    }],
    dislikedSongs:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
    }],
    

})

const userModel = mongoose.model('User', userSchema, 'users');

export default userModel;