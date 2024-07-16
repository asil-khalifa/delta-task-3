import userModel from '../models/user.js'
import bcrypt from 'bcrypt'

async function addUser(req, res) {
    let { username, name, password, isArtist, profileColor } = req.body;

    try {
        //valid username?
        const duplicateUsers = await userModel.find({username});
        if (duplicateUsers.length){
            return res.json({success: false, message: 'Duplicate Username!', errorCode: 'usernameDuplicate'});
        }

        //validate isArtist:
        if (isArtist === 'true' || isArtist === true){
            isArtist = true;
        }
        else if (isArtist === 'false' || isArtist === false){
            isArtist = false;
        }
        else{
            return res.json({success: false, message: 'isArtist should be either true or false!', errorCode: 'isArtistNotValid'})
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
        await user.save();
        res.json({ success: true, message: 'User added', user})

    } catch (e) {
        console.log('Error adding user:', e);
        res.json({ success: false, message: e });
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

async function authenticateUser(req, res){
    const {username, password} = req.body;
    try{
        const user = await userModel.findOne({username});
        if (!user) return res.json({success: false, errorCode: 'usernameNotExist'});

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.json({success: false, errorCode: 'invalidCredentials'});

        res.cookie('test', 'testing')

        res.json({success: true, user});
    }catch(err){
        res.json({success: false, errorCode: 'unknownError', err});
    }
}

async function getUserDetails(req, res){
    try{
        const {id} = req.params;
        
        const user = await userModel.findById(id);
        if (!user) return res.json({success: false, errorCode: 'idNotExist'});

        res.json({success: true, user})
    }catch(err){
        res.json({success: false, errorCode: 'unknownError'});
    }
    
}

export { addUser, listUser, authenticateUser, getUserDetails };