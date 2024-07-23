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
        console.log('Warning: in sendPlay no user found in db');
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

function startSocket() {

    io.on('connection', socket => {
        users.loggedOut.push(new User(socket.id));
        // socket.emit('getUserAuth'); //for handling reloading a page where user islogged in

        socket.on('disconnect', async reason => {
            try {

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

                        if (user.loggedIn) {
                            //if user was already loggedin:
                            //  if different userid, disassociate this socket.id with the earlier userId
                            //  if same, do nothing
                            if (user.userId !== userId) {
                                //don't leave empty users
                                if (user.socketIds.length > 1) {
                                    user.socketIds.splice(user.socketIds.indexOf(socket.id));
                                    users.loggedIn.push(new User(socket.id, true, userId));
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
                            }
                            else {
                                user.setLoggedIn(true);
                                user.setUserId(userId);
                                users.loggedIn.push(user);
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

        //socket emits sendPlay: for showing playing song to friends
        socket.on('sendPlay', async ({ trackId, currentTime }) => {
            console.log('sendPlay', trackId, currentTime);

            const user = findUserBySocketId(socket.id);
            if (!user?.loggedIn) return;

            const trackDb = await songModel.findById(trackId);

            toAllFriends(user, (fSocket, userDb) => {
                fSocket.emit('getFriendSong', { username: userDb.username, name: userDb.name, trackId, trackName: trackDb.name, profileColor: userDb.profileColor, isArtist: userDb.isArtist });
            });

        })

    })
}

export { startSocket };