import { io } from "./server.js";

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

class Party{
    constructor(hostId){
        this.hostId = hostId;
    }
}


function startSocket() {

    io.on('connection', socket => {
        users.loggedOut.push(new User(socket.id));

        socket.on('disconnect', reason => {
            try{

                // console.log(socket.id, reason, findUserBySocketId(socket.id));
                const user = findUserBySocketId(socket.id);
                if (user.socketIds.length>1){
                    user.socketIds.splice(user.socketIds.indexOf(socket.id));
                }
                else{
                    if (user.loggedIn) users.loggedIn.splice(users.loggedIn.indexOf(user));
                    else users.loggedOut.splice(users.loggedOut.indexOf(user));
                }
            }catch(err){
                console.log('error in disconnect', err);
            }
        });

        //to properly update users list
        socket.on('authChange', ({ loggedIn, userId }) => {
            try{
                
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
            }catch(err){
                console.log('error in authChange', err);
            }

        }
        )

        socket.on('disconnecting', () => {
            // console.log(socket.rooms);
        })



    })
}

export { startSocket };