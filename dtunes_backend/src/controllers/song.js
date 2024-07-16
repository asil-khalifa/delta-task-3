import { v2 as cloudinary } from 'cloudinary';
import songModel from '../models/song.js'

// import connectCloudinary from '../config/cloudinary.js';

// cloudinary.config()

// async function uploadTrial(path1, path2, options1, options2){
//     try{
//         const audioUpload = await cloudinary.uploader.upload(path1, options1)
//         const imageUpload = await cloudinary.uploader.upload(path2, options2)

//         return audioUpload, imageUpload
//     }
//     catch(e){
//         console.log(e);
//         return false;
//     }
// }

// async function addSong(req, res){

//     let tries = 0;
//     const {name, desc, playlist} = req.body;
//     const {image, audio} = req.files;

//     const imageFile = image[0];
//     const audioFile = audio[0];
//     console.log(name, desc, playlist, imageFile.path, audioFile.path);
//     let success = false;

//     while(tries<=5){

//         let resp = await uploadTrial(audioFile.path, imageFile.path, {resource_type: 'video'}, {resource_type: 'image'})

//         if (resp){
//             audioUpload, imageUpload = resp;
//             success = true;
//             break;
//         }
//         else{
//             tries++;
//             console.log('Trying', tries)
//         }
//     }

//     if (success){
//         console.log(audioUpload, imageUpload);
//         res.send('Sucess');
//     }
//     else{
//         res.send('error');
//     }

// }

async function addSong(req, res) {
    const { name, desc, playlist } = req.body;
    const { image, audio } = req.files;

    const imageFile = image[0];
    const audioFile = audio[0];
    // console.log(name, desc, playlist, imageFile.path, audioFile.path);

    try {
        const audioUpload = await cloudinary.uploader.upload(audioFile.path, { resource_type: 'video' })
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })

        // console.log(audioUpload, imageUpload)

        const duration_m = Math.floor(audioUpload.duration / 60);
        const duration_s = Math.floor(audioUpload.duration % 60);

        const duration = `${duration_m}:${duration_s < 10 ? '0' : ''}${duration_s}`

        const songData = {
            name,
            desc,
            playlist,
            image: imageUpload.secure_url,
            file: audioUpload.secure_url,
            duration,
        }

        const song = songModel(songData);
        await song.save();
        res.json({ success: true, message: 'Song added' })

    } catch (e) {
        console.log('Error adding song:', e);
        res.json({ success: false, message: e });
    }
}

async function listSong(req, res) {
    try {
        const allSongs = await songModel.find({});
        res.json({ success: true, message: 'Successful', songs: allSongs })
    } catch (e) {
        res.json({ success: false, message: e })
    }
}

async function removeSong(req, res) {
    try {
        const { id } = req.params;
        await songModel.findByIdAndDelete(id);
        res.json({ success: true, message: 'Deleted Successfully' })
    } catch (e) {
        res.json({ success: false, message: e });
    }
}

// async function seedSongLikes(req, res){
//     await songModel.updateMany({}, {$set: {likes: [], dislikes: []}});
//     res.send('done');
// }

//If user already liked, removes it, else adds like:
async function addLike(req, res){
    try{
        const {userId, songId} = req.body;
        const song = await songModel.findById(songId);


        const alreadyLiked = song.likes.filter((likeId) => likeId.equals(userId))
        const wasLiked = alreadyLiked.length>0;
        if(wasLiked){
            song.likes = song.likes.filter(likeId => !likeId.equals(userId));
            await song.save();
        }
        else{
            song.likes.push(userId);
            await song.save();
            
        }

        res.json({success: true, wasLiked});
    }catch(err){
        res.json({success: false, error: err})
        console.log(err);
    }
}

//If user already dislike, removes it, else adds dislike:

async function addDislike(req, res){
    try{
        const {userId, songId} = req.body;
        const song = await songModel.findById(songId);

        const alreadyDisliked = song.dislikes.filter((likeId) => likeId.equals(userId))
        const wasDisliked = alreadyDisliked.length>0;
        if(wasDisliked){
            song.dislikes = song.dislikes.filter(likeId => !likeId.equals(userId));
            await song.save();
        }
        else{
            song.dislikes.push(userId);
            await song.save();
            
        }

        res.json({success: true, wasDisliked});
    }catch(err){
        res.json({success: false, error: err})
        console.log(err);
    }
}
export { addSong, listSong, removeSong, addLike, addDislike};