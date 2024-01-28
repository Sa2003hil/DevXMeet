import React, { useMemo, useEffect, useState, useCallback } from "react";

const PeerContext = React.createContext(null);

export const usePeer = () => React.useContext(PeerContext);

export const PeerProvider = (props) => {
    const [remoteStream, setremoteStream] = useState(null);
    const peer = useMemo(() => new RTCPeerConnection({
        iceServers: [
            {
                urls: [
                    "stun:stun.l.google.com:19302",
                    "stun:global.stun.twilio.com:3478",
                ],
            },
        ],
    }), []) // this is used to create a new peer connection for identifying the Public IP address of the user

    const createOffer = async () => {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        return offer;
    }


    const createAnswer = async (offer) => {
        await peer.setRemoteDescription(offer); // uske offer ko yaad kar liya
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer); // set the answer as local description
        return answer;
    }

    const setRemoteAnswer = async (answer) => {
        await peer.setRemoteDescription(answer)
    }

    const sendStream = async (myStream) => {
        const tracks = myStream.getTracks();

        // Check if a sender already exists for each track and remove it
        tracks.forEach((track) => {
            const existingSender = peer.getSenders().find((sender) => sender.track === track);
            if (existingSender) {
                peer.removeTrack(existingSender);
            }
        });

        // Add the tracks to the peer connection
        tracks.forEach((track) => {
            peer.addTrack(track, myStream);
        });
    };


    const handleTrackEvent = useCallback((ev) => {
        const [remoteStream] = ev.remoteStreams;
        setremoteStream(remoteStream[0]);
    }, [])



    useEffect(() => {
        peer.addEventListener('track', handleTrackEvent)
        return () => {
            peer.removeEventListener('track', handleTrackEvent)
        }
    }, [peer, handleTrackEvent]);

    return <PeerContext.Provider value={{ peer, createOffer, createAnswer, setRemoteAnswer, sendStream, remoteStream }}>{props.children}</PeerContext.Provider>
}