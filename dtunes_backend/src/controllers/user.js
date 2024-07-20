import userModel from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

async function addUser(req, res) {
    let { username, name, password, isArtist, profileColor } = req.body;

    try {
        //valid username?
        const duplicateUsers = await userModel.find({ username });
        if (duplicateUsers.length) {
            return res.json({ success: false, message: 'Duplicate Username!', errorCode: 'usernameDuplicate' });
        }

        //validate isArtist:
        if (isArtist === 'true' || isArtist === true) {
            isArtist = true;
        }
        else if (isArtist === 'false' || isArtist === false) {
            isArtist = false;
        }
        else {
            return res.json({ success: false, message: 'isArtist should be either true or false!', errorCode: 'isArtistNotValid' })
        }


        password = await bcrypt.hash(password, 12);

        const userData = {
            username,
            name,
            password,
            isArtist,
            profileColor,
        }

        const user = userModel(userData);

        //jwt:
        let userJson = user.toJSON();
        delete userJson.password;
        delete userJson?.refreshToken;

        //access token expire time (search for this comment for other places)
        const accessToken = jwt.sign(userJson, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
        const refreshToken = jwt.sign(userJson, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: '1d' })

        user.refreshToken = refreshToken;

        await user.save();

        //! if something goes wrong, try removing samesite: None and secure: true (if you do, also remove in res.clearCookie in logout)
        //, samesite: 'none', secure: true
        res.cookie('dtunesRefreshToken', refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 1 })
        res.json({ success: true, user: userJson, accessToken });

    } catch (e) {
        console.log('Error adding user:', e);
        res.json({ success: false, errorCode: 'unknownError', message: 'controllers>adduser.js' });
    }
}

async function listUser(req, res) {
    try {
        const allUsers = await userModel.find({});
        res.json({ success: true, message: 'Successful', users: allUsers })
    } catch (e) {
        res.json({ success: false, message: e })
    }
}

async function authenticateUser(req, res) {
    const { username, password } = req.body;
    // console.log('username:', username, 'password', password);
    try {
        const user = await userModel.findOne({ username });
        if (!user) return res.json({ success: false, errorCode: 'usernameNotExist' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.json({ success: false, errorCode: 'invalidCredentials' });

        //jwt:
        //!expire
        //jwt accepts json user not mongoose model
        let foundUser = user.toJSON();
        delete foundUser.password; //remove password before making token from it 
        delete foundUser?.refreshToken;

        //access token expire time (search for this comment for other places)
        const accessToken = jwt.sign(foundUser, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
        const refreshToken = jwt.sign(foundUser, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: '1d' })

        //store refresh token in db
        user.refreshToken = refreshToken;
        await user.save();

        //! if something goes wrong, try removing samesite: None and secure: true (if you do, also remove in res.clearCookie in logout)
        //, samesite: 'none', secure: true
        res.cookie('dtunesRefreshToken', refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 1 })
        res.json({ success: true, user: foundUser, accessToken });

    } catch (err) {
        res.json({ success: false, errorCode: 'unknownError', message: 'controllers>authenticateUser' });
        console.log('error', err);
    }
}

async function getUserDetails(req, res) {
    try {
        const { id } = req.params;

        const user = await userModel.findById(id);
        if (!user) return res.json({ success: false, errorCode: 'idNotExist' });

        res.json({ success: true, user })
    } catch (err) {
        res.json({ success: false, errorCode: 'unknownError', message: 'from getUserDetails in controllers>user.js' });
    }

}

async function getLikedSongs(req, res) {
    try {
        //old method:
        // const {id} = req.params;

        const { _id: id } = req.authenticatedUser;
        // console.log(req.authenticatedUser._id);
        const user = await userModel.findById(id).populate('likedSongs');
        if (!user) return res.json({ success: false, errorCode: 'idNotExist' });

        return res.json({ success: true, likedSongs: user.likedSongs });

    } catch (err) {
        console.log(err);
        res.json({ success: false, errorCode: 'unknownError', error: err });
    }
}

function privateTest(req, res) {

    const authenticatedUser = req?.authenticatedUser;
    res.json({ success: true, gotUser: authenticatedUser })
}

// async function resetLikes(req, res){
//     const allUsers = await userModel.updateMany({}, {$set: {likedSongs: [], dislikedSongs: []}});
//     res.send('done');

// }

export { addUser, listUser, authenticateUser, getUserDetails, getLikedSongs };

export { privateTest }