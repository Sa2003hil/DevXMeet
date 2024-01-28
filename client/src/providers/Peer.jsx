import React, { useMemo } from "react";

const PeerContext = React.createContext(null);

export const usePeer = () => React.useContext(PeerContext);

export const PeerProvider = (props) => {
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

    return <PeerContext.Provider value={{ peer, createOffer, createAnswer, setRemoteAnswer }}>{props.children}</PeerContext.Provider>
}