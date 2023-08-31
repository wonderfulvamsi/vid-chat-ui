import React, { useState, useRef, useEffect } from 'react';
import Peer from "simple-peer";
import styled from "styled-components";

const Container = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
`;

const StyledVideo = styled.video`
    flex: 1 0 auto;
    min-width: 360px;
    width: ${props => props.width};                        // <--- need to control the height param programmatically!
    max-height: 98.5%;
    background-color: #2F2B2B;
    border: 1px solid #3F4143;
    margin: 5px;
`;

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <StyledVideo width={props.width} playsInline autoPlay ref={ref} />
    );
}


function VideoRoom({socket, roomid, username, userStream}) {
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const roomID = roomid;

  useEffect(() => {
      socketRef.current = socket;
      console.log("I am", socketRef.current.id)
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
          userVideo.current.srcObject = stream;
          userStream.current = stream;
          socketRef.current.emit("join_room", roomID);
          socketRef.current.on("all_usersInRoom", users => {
              const peers = [];
              users.forEach(userID => {
                  const peer = createPeer(userID, socketRef.current.id, stream);
                  peersRef.current.push({
                      peerID: userID,
                      peer,
                  })
                  peers.push({
                    peerID: userID,
                    peer
                  });
              })
              setPeers(peers);
          })
          console.log("all fuckers in the room", peersRef.current)
          socketRef.current.on("user_joined", payload => {
              const peer = addPeer(payload.signal, payload.callerID, stream);
              peersRef.current.push({
                  peerID: payload.callerID,
                  peer,
              })

              const peerObj = {
                peer,
                peerID: payload.callerID
              }
              setPeers(users => [...users, peerObj]);
              console.log("Some fucker joind the room", payload.callerID, peersRef.current)
          });

          socketRef.current.on("receiving_returned_signal", payload => {
              const item = peersRef.current.find(p => p.peerID === payload.id);
              item.peer.signal(payload.signal);
          });
          
          socketRef.current.on("notify-left", id=>{
            const peerObj = peersRef.current.find(p=> p.peerID == id);
            if(peerObj){
              peerObj.peer.destroy();
            }  
            const peers = peersRef.current.filter(p => p.peerID != id);
            peersRef.current = peers;
            setPeers(peers);
            console.log("Some fucker left", id, peersRef.current)
          })
      })
  }, []);

  function createPeer(userToSignal, callerID, stream) {
      const peer = new Peer({
          initiator: true,
          trickle: false,
          stream,
      });

      peer.on("signal", signal => {
          socketRef.current.emit("sending_signal", { userToSignal, callerID, signal })
      })

      return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
      const peer = new Peer({
          initiator: false,
          trickle: false,
          stream,
      })

      peer.on("signal", signal => {
          socketRef.current.emit("returning_signal", { signal, callerID })
      })

      peer.signal(incomingSignal);

      return peer;
  }

  const getVidWidth = (len)=>{
    if(len == 0){
        console.log("there are no peers")
        return "98.5%";
    }
    else if(len%2 == 0){
        console.log("there are even no of peers")
        return "360px";
    }
    else{
        console.log("there are odd no of peers")
        return "40%"
    }
  }

  return (
    <Container className='allVideosContainer'>
        <StyledVideo width={getVidWidth(peersRef.current.length)} muted ref={userVideo} autoPlay playsInline />
        {peersRef.current.map((peer) => {
            return (
                <Video key={peer.peerID} peer={peer.peer} width={getVidWidth(peersRef.current.length)} />
            );
        })}
    </Container>
  );
};

export default VideoRoom