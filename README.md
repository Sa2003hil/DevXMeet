# WebRTC

WebRTC (Web Real-Time Communication) is a free, open-source project that provides web browsers and mobile applications with real-time communication via application programming interfaces (APIs). WebRTC is commonly used for video chat, voice calling, and peer-to-peer file sharing without the need for plugins or additional software.

- UDP (User Datagram Protocol) is one of the transport protocols used in WebRTC. In WebRTC, UDP is typically used for transmitting real-time media streams, such as audio and video. UDP is a connectionless protocol, which means that it doesn't establish a dedicated connection before sending data, unlike TCP (Transmission Control Protocol). Instead, it sends data packets without guaranteeing delivery or ensuring the order of packets. 

## What is the differnce between Public and Private IP address?

A public IP address is an IP address that can be accessed over the Internet. Like postal address used to deliver a postal mail to your home, a public IP address is the globally unique IP address assigned to a computing device. Your public IP address can be found at What is my IP Address page.

A private IP address is the address space allocated by InterNIC to allow organizations to create their own private network. There are three IP blocks (1 class A, 1 class B and 1 class C) reserved for a private use. The computers, tablets and smartphones sitting behind your home or office router have private IP addresses. They are also called as local IP addresses. Your router has two IP addresses, one is its own private address on the local network and the other is the external, public IP address that's used for communicating with outside networks on the Internet.


## Drawback of WebRTC

- WebRTC is a P2P technology .
    There are more topology in WebRTC like Mesh, SFU, and P2P.the most commonly used is sfu( Selective Forwarding Unit) like in googleMeet ,zoom etc... and P2P( Peer 2 Peer ) in Omegle .

   - SFU ( Selective Forwarding Unit )  ---> Commonly used in googleMeet , zoom etc...
    In SFU, there is a server that receives the stream from the sender and then forwards it to all the other participants.In this topology suppose there are 4 clients , the client1 makes a P2P connection  with the main server , client 2 also make a connection with the server .. similarly client 3 and client 4 also make a connection with the server . Now the VirtualMachine/Server makes a single frame of all the 4 client videos and make a single videos of all these 4 videos and separate by a grid.