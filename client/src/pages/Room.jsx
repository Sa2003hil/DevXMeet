import React, { useEffect, useCallback } from 'react'
import { useSocket } from '../providers/Socket'
import { usePeer } from '../providers/Peer'

const Room = () => {
    const { socket } = useSocket();
    const { peer, createOffer } = usePeer();

    const handleNewUserJoined = useCallback(async (data) => {
        const { emailId } = data;
        console.log("new user joined", emailId);

        // create an offer and send it to the new user
        const offer = await createOffer();
        socket.emit('call-user', { emailId, offer })
    }, [createOffer, socket]);

    const handleIncommingCall = useCallback((data) => {
        const { from, offer } = data
        console.log("Incomming call from ", from, offer);
    }, [])


    useEffect(() => {
        socket.on('user-joined', handleNewUserJoined)
        socket.on('incomming-call', handleIncommingCall)

        return () => {
            socket.off('user-joined', handleNewUserJoined)
            socket.off('incomming-call', handleIncommingCall)
        }

    }, [handleIncommingCall, handleNewUserJoined, socket])
    return (
        <div className='h-screen w-screen flex items-center justify-center'>
            <h1 className='text-9xl uppercase  font-black'>
                Room
            </h1>
        </div>
    )
}

export default Room