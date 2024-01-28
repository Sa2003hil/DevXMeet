import React, { useEffect, useCallback, useState } from 'react'
import ReactPlayer from 'react-player'
import { useSocket } from '../providers/Socket'
import { usePeer } from '../providers/Peer'
import { Button } from "@material-tailwind/react";

const Room = () => {
    const { socket } = useSocket();
    const { peer, createOffer, createAnswer, setRemoteAnswer, sendStream, remoteStream } = usePeer();
    const [myStream, setmyStream] = useState(null);
    const [remoteEmailId, setRemoteEmailId] = useState();

    const handleNewUserJoined = useCallback(async (data) => {
        const { emailId } = data;
        console.log("new user joined", emailId);

        // create an offer and send it to the new user
        const offer = await createOffer();
        socket.emit('call-user', { emailId, offer })
        setRemoteEmailId(emailId);
    }, [createOffer, socket]);

    const handleIncommingCall = useCallback(async (data) => {
        const { from, offer } = data
        console.log("Incomming call from ", from, offer);

        // create an answer and send it to the user A
        const ans = await createAnswer(offer);
        socket.emit('call-accepted', { emailId: from, answer: ans })
        setRemoteEmailId(from);
    }, [createAnswer, socket])


    const handleCallAccepted = useCallback(async (data) => {
        const { answer } = data;
        console.log('call got accepted', answer);
        await setRemoteAnswer(answer)

    }, [setRemoteAnswer])

    const getUserMediamyStream = useCallback(async () => {
        const myStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        // sendStream(myStream);
        setmyStream(myStream);
    }, [])

    const handleNegotiationNeededEvent = useCallback(() => {
        const localOffer = peer.localDescription;
        socket.emit('call-user', { emailId: remoteEmailId, offer: localOffer })

    }, [peer.localDescription, remoteEmailId, socket])

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

    useEffect(() => {
        peer.addEventListener('negotiationneeded', handleNegotiationNeededEvent)
        return () => {
            peer.removeEventListener('negotiationneeded', handleNegotiationNeededEvent)
        }
    }, [handleNegotiationNeededEvent, peer])

    useEffect(() => {
        getUserMediamyStream();
    }, [getUserMediamyStream])

    return (
        <div className=' overflow-hidden flex flex-col items-center justify-center'>
            <p color="blue-gray" className="flex justify-center m-auto mt-10 text-4xl gap-1 mb-8">
                Welcome to <span className=" text-pink-400 font-light">DevXMeet</span>
            </p>
            <p className='text-2xl font-extralight my-3'>You are connected to <span className='font-medium'>{remoteEmailId}</span></p>
            <div className=' flex items-start gap-4 justify-center '>
                <ReactPlayer url={myStream} playing muted />
                <ReactPlayer url={remoteStream} playing muted />
            </div>
            <Button onClick={(e) => sendStream(myStream)} className='bg-black text-white mt-10'>Connect</Button>

        </div>
    )
}

export default Room