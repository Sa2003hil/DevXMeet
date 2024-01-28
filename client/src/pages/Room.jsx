import React, { useEffect, useCallback } from 'react'
import { useSocket } from '../providers/Socket'
import { usePeer } from '../providers/Peer'

const Room = () => {
    const { socket } = useSocket();
    const { peer, createOffer, createAnswer, setRemoteAnswer } = usePeer();

    const handleNewUserJoined = useCallback(async (data) => {
        const { emailId } = data;
        console.log("new user joined", emailId);

        // create an offer and send it to the new user
        const offer = await createOffer();
        socket.emit('call-user', { emailId, offer })
    }, [createOffer, socket]);

    const handleIncommingCall = useCallback(async (data) => {
        const { from, offer } = data
        console.log("Incomming call from ", from, offer);

        // create an answer and send it to the user A
        const ans = await createAnswer(offer);
        socket.emit('call-accepted', { emailId: from, answer: ans })
    }, [createAnswer, socket])


    const handleCallAccepted = useCallback(async (data) => {
        const { answer } = data;
        console.log('call got accepted', answer);
        await setRemoteAnswer(answer)

    }, [setRemoteAnswer])

    useEffect(() => {
        socket.on('user-joined', handleNewUserJoined)
        socket.on('incomming-call', handleIncommingCall)
        socket.on('call-accepted', handleCallAccepted)

        return () => {
            socket.off('user-joined', handleNewUserJoined)
            socket.off('incomming-call', handleIncommingCall)
            socket.off('call-accepted', handleCallAccepted)
        }

    }, [handleCallAccepted, handleIncommingCall, handleNewUserJoined, socket])
    return (
        <div className='h-screen w-screen flex items-center justify-center'>
            <h1 className='text-9xl uppercase  font-black'>
                Room
            </h1>
        </div>
    )
}

export default Room