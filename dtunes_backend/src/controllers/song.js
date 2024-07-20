import { v2 as cloudinary } from 'cloudinary';
import songModel from '../models/song.js'
import userModel from '../models/user.js';

async function addSong(req, res) {
    const { name, desc } = req.body;
    const { image, audio } = req.files;

    const imageFile = image[0];
    const audioFile = audio[0];

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


//If user already liked, removes it, else adds like:
async function addLike(req, res){
    try{
        const {_id: userId} = req.authenticatedUser;
        const {songId} = req.body;

        const song = await songModel.findById(songId);
        const user = await userModel.findById(userId);

        const alreadyLiked = song.likes.filter((likeId) => likeId.equals(userId))
        const wasLiked = alreadyLiked.length>0;

        const alreadyDisliked = song.dislikes.filter((likeId) => likeId.equals(userId))
        const wasDisliked = alreadyDisliked.length>0;
        //update id's both in user and the song:
        if(wasLiked){
            song.likes = song.likes.filter(likeId => !likeId.equals(userId));
            await song.save();

            user.likedSongs = user.likedSongs.filter(sId => !sId.equals(songId));
            await user.save();
        }
        else{
            song.likes.push(userId);
            await song.save();

            user.likedSongs.push(songId);
            await user.save();

            //prevent both like and dislike:
            if (wasDisliked){
                song.dislikes = song.dislikes.filter(likeId => !likeId.equals(userId));
                await song.save();
    
                user.dislikedSongs = user.dislikedSongs.filter(sId => !sId.equals(songId));
                await user.save();
            }
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
        const {_id: userId} = req.authenticatedUser;
        const {songId} = req.body;

        const song = await songModel.findById(songId);
        const user = await userModel.findById(userId);

        const alreadyDisliked = song.dislikes.filter((likeId) => likeId.equals(userId))
        const wasDisliked = alreadyDisliked.length>0;

        const alreadyLiked = song.likes.filter((likeId) => likeId.equals(userId))
        const wasLiked = alreadyLiked.length>0;

        if(wasDisliked){
            song.dislikes = song.dislikes.filter(likeId => !likeId.equals(userId));
            await song.save();

            user.dislikedSongs = user.dislikedSongs.filter(sId => !sId.equals(songId));
            await user.save();
        }
        else{
            song.dislikes.push(userId);
            await song.save();
            
            user.dislikedSongs.push(songId);
            await user.save();

            //prevent both like and dislike
            if (wasLiked){
                song.likes = song.likes.filter(likeId => !likeId.equals(userId));
                await song.save();
    
                user.likedSongs = user.likedSongs.filter(sId => !sId.equals(songId));
                await user.save();
            }
        }

        res.json({success: true, wasDisliked});
    }catch(err){
        res.json({success: false, error: err})
        console.log(err);
    }
}

// async function seedUserLikes(req, res){
//     const response = await userModel.updateMany({}, {$set: {likedSongs: [], dislikedSongs: []}});
//     console.log(response);
//     res.send('done');
// }

// async function seedSongLikes(req, res){
//     await songModel.updateMany({}, {$set: {likes: [], dislikes: []}});
//     res.send('done');
// }


export { addSong, listSong, removeSong, addLike, addDislike};

// export {seedSongLikes};
