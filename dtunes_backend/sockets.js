import { io } from "./server.js";
import songModel from "./src/models/song.js";
import userModel from "./src/models/user.js";

//user:

let users = {
    loggedIn: [],
    loggedOut: [],
}

class User {
    constructor(socketId, loggedIn = false, userId = '') {
        this.socketIds = [socketId];
        this.loggedIn = loggedIn;
        this.userId = userId;
    }

    setLoggedIn(bool) {
        this.loggedIn = bool;
    }

    setUserId(id) {
        this.userId = id;
    }
}

function findUserByUserId(id) {
    //return user instance if found, else false
    if (!id) return false;
    for (let user of users.loggedIn) {
        if (user.userId === id) return user;
    }
    return false;
}

function findUserBySocketId(id) {
    //return user instance if found, else false
    if (!id) return false;
    for (let user of users.loggedIn) {
        for (let socketId of user.socketIds) {
            if (id === socketId) return user;
        }
    }
    for (let user of users.loggedOut) {
        for (let socketId of user.socketIds) {
            if (id === socketId) return user;
        }
    }
    return false;
}


//party:

let parties = [];

class Party {
    constructor(hostId) {
        this.hostId = hostId;
    }
}

//do same function to add friends:

async function toAllFriends(user, func, debugMessage) {
    'Does func to all friends of user'
    'func takes on parameters: friendSocketId userDb'

    const sockets = await io.fetchSockets();
    const userDb = await userModel.findById(user.userId);
    if (!userDb) {
        console.log('Warning: in toAllFriends no user found in db');
        return false;
    }
    const friends = userDb.friends.accepted;

    for (let fSocket of sockets) {
        const fUser = findUserBySocketId(fSocket.id);

        if (friends.find(fId => fId.equals(fUser?.userId))) {
            func(fSocket, userDb);
            if (debugMessage) console.log(debugMessage);
        }
    }
}


//Sync playback:
// function setNewLoginTrack(socket, ogUser){
//     console.log('here', ogUser.trackId);
//     if(ogUser.trackId) socket.emit('getTrack', {trackId: ogUser.trackId});
// }

// async function setNewLoginDuration(socket, ogUser){
//     console.log('hi');
//     // if(ogUser.trackId) socket.emit('getDuration', {trackId: ogUser.trackId});
//     const sockets = await io.fetchSockets();
//     const firstSocket = sockets.find(s=>s.id === ogUser.socketIds[0]);
//     if(ogUser.trackId) firstSocket.emit('durationRequest', duration => {
//         console.log('here2', duration);
//         socket.emit('getDuration', {duration});
//     });

// }

// function sendSyncedState(socket, state){
//     socket.emit('getSyncedState', state);
// }


function startSocket() {

    io.on('connection', socket => {
        users.loggedOut.push(new User(socket.id));
        // socket.emit('getUserAuth'); //for handling reloading a page where user islogged in

        socket.on('disconnect', async reason => {
            try {
                // sendSyncedState(socket, false);
                // console.log(socket.id, reason, findUserBySocketId(socket.id));
                const user = findUserBySocketId(socket.id);

                const user_ = {...user};
                console.log(user, user_);
                //remove currently playing song from all friends:
                if (user_.loggedIn) {
                    toAllFriends(user_, (fSocket, userDb) => {
                        fSocket.emit('getFriendSongRemove', { username: userDb.username });
                    });
                }

                //deal with user object:
                if (user.socketIds.length > 1) {
                    user.socketIds.splice(user.socketIds.indexOf(socket.id));
                }
                else {
                    if (user.loggedIn) users.loggedIn.splice(users.loggedIn.indexOf(user));
                    else users.loggedOut.splice(users.loggedOut.indexOf(user));
                }
            } catch (err) {
                console.log('error in disconnect', err);
            }
        });

        //to properly update users list
        socket.on('authChange', ({ loggedIn, userId }) => {
            try {

                const user = findUserBySocketId(socket.id);
                if (user) {
                    //socket is now logging in
                    if (loggedIn) {
                        //if user was already loggedin:
                        //  if different userid, disassociate this socket.id with the earlier userId
                        //  if same, do nothing
                        if (user.loggedIn) {
                            if (user.userId !== userId) {
                                //don't leave empty users
                                if (user.socketIds.length > 1) {
                                    user.socketIds.splice(user.socketIds.indexOf(socket.id));
                                    users.loggedIn.push(new User(socket.id, true, userId));
                                    // sendSyncedState(socket, true);
                                }
                                else {
                                    user.userId = userId;
                                }
                            }
                        }
                        //if user was not:
                        //  if you find another user with userId (naturally, in loggedIn), merge them
                        //  else, add to loggedIN
                        else {
                            users.loggedOut.splice(users.loggedOut.indexOf(user));

                            const anotherUser = findUserByUserId(userId);
                            if (anotherUser) {
                                anotherUser.socketIds.push(socket.id);

                                //2nd point of sync playback, set track_id of this new user to given track id
                                // setTimeout(() => {
                                // setTimeout(() => setNewLoginTrack(socket, anotherUser), 1250);
                                // setTimeout(() => setNewLoginDuration(socket, anotherUser), 1250)
                                // }, 100);
                            }
                            else {
                                user.setLoggedIn(true);
                                user.setUserId(userId);
                                users.loggedIn.push(user);
                                // sendSyncedState(socket, true);

                            }
                        }
                    }

                    //socket is now logging out:
                    else {
                        //if already loggedOut, do nothing
                        //if was loggedIn, cause this socketId alone to be noted as logged out
                        if (user.loggedIn) {

                            //remove playing songs from friends:
                            const user_ = {...user};
                            console.log(user, user_);
                            //remove currently playing song from all friends:
                            if (user_.loggedIn) {
                                toAllFriends(user_, (fSocket, userDb) => {
                                    fSocket.emit('getFriendSongRemove', { username: userDb.username });
                                });
                            }

                            //note as logged out:
                            if (user.socketIds.length > 1) {
                                user.socketIds.splice(user.socketIds.indexOf(socket.id));
                                users.loggedOut.push(new User(socket.id));
                            }
                            else {
                                users.loggedIn.splice(users.loggedIn.indexOf(user));
                                user.setLoggedIn(false);
                                user.setUserId('');
                                users.loggedOut.push(user);
                            }
                        }
                    }

                }
                else {
                    console.log('Warning, sockets.js no user with this socketid', socket.id);
                }

                //!debug:
                // console.log(users);
                console.log('=========== loggedin ==========');
                users.loggedIn.forEach(u => console.log(u))
                console.log('=========== loggedOut ==========');
                users.loggedOut.forEach(u => console.log(u))
                console.log('--------------------------------------------------\n\n')
            } catch (err) {
                console.log('error in authChange', err);
            }

        }
        )

        socket.on('disconnecting', () => {
            // console.log(socket.rooms);
        })

        //socket emits sendFriendTrack: for showing playing song to friends
        socket.on('sendFriendTrack', async ({ trackId }) => {
            try{

                const user = findUserBySocketId(socket.id);
                if (!user?.loggedIn) return;
    
                const trackDb = await songModel.findById(trackId);
    
                toAllFriends(user, (fSocket, userDb) => {
                    fSocket.emit('getFriendSong', { username: userDb.username, name: userDb.name, trackId, trackName: trackDb.name, profileColor: userDb.profileColor, isArtist: userDb.isArtist });
                });
            }catch(err){
                console.log('error in sockets.js show playing song to friends', err);
            }

        })

        //-------- SYNC PLAYBACK----------------

            // 1. socket emits sendSyncTrack: when the track is changed, this is sent
        socket.on('sendSyncTrack', async ({trackId}) => {
            try{
                const user = findUserBySocketId(socket.id);
                if (user && trackId){
                    console.log('here4');
                    user.trackId = trackId;

                    const sockets = await io.fetchSockets();
                    const otherSocketIds = user.socketIds.filter(sId => sId!==socket.id);

                    sockets.forEach(s => {
                        if (otherSocketIds.find(sId => sId===s.id)){
                            console.log('hi');
                            s.emit('getTrack', {trackId});
                        }
                    })
                }
                // console.log('socket:', socket.id, trackId, 'current:', user.trackId);
            }catch(err){
                console.log('error in sendSyncTrack', err);
            }
        })
        //(NOT IMPLEMENTED) Note: a user is blocked from sending syncPlay until they get a sync play from others (2nd login) or they're the first login - handled via synced state in PlayerContext


            //2 when logging in, we're checking if same userId has loggedin and if so
            //A. new login's track is set
            //search for setNewLoginTrack for implementation
            
            //B. emit request for latest duration from first socketId and set this socketId to that
            //search for setNewLoginDuration for implementation

        //3. When user clicks on progress bar, emit sendDuration to server and set it
        //in playerContext.jsx search for sendSyncDuration 
        //in this file, search sendSyncedState

        socket.on('sendDuration', async ({duration}) => {
            try{
                const user = findUserBySocketId(socket.id);
                if(!user) throw new Error('No user found');

                let otherSocketIds = user.socketIds.filter(sId => sId!==socket.id);
                if(!otherSocketIds.length) return;

                const sockets = await io.fetchSockets();
                sockets.forEach(s => {
                    if(otherSocketIds.find(sId => sId === s.id)){
                        s.emit('getDuration', {duration});
                    }
                })
            }catch(err){
                console.log('error in sendDuration', err);
            }
        })

        socket.on('sendPause', async () => {
            const user = findUserBySocketId(socket.id);
            const sockets = await io.fetchSockets();
            const otherSocketIds = user.socketIds.filter(sId => sId!==socket.id);

            sockets.forEach(s => {
                if (otherSocketIds.find(sId=> sId===s.id)){
                    s.emit('getPause');
                }
            })
        })

        socket.on('sendPlay', async () => {
            const user = findUserBySocketId(socket.id);
            const sockets = await io.fetchSockets();
            const otherSocketIds = user.socketIds.filter(sId => sId!==socket.id);

            sockets.forEach(s => {
                if (otherSocketIds.find(sId=> sId===s.id)){
                    s.emit('getPlay');
                }
            })
        })
            
    })
}

export { startSocket };