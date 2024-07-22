import React, { createContext, useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { socket } from '../socket';

export const SocketContext = createContext({});

export const SocketProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(socket.connected);

    const { auth } = useAuth();
    const { loggedIn, user } = auth;

    // socket = socketio.connect('http://localhost:2006', {
    //     query: obj,
    // })

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnnect', onDisconnect);

        //cleanup function:
        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnnect', onDisconnect);
        }
    }, [])

    useEffect(() => {
        socket.emit('authChange', { loggedIn, userId: user?._id });
    }, [loggedIn, user?._id])

    return (
        <>
            {children}
        </>
    )
}

export { socket };