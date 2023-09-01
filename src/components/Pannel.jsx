import React from 'react'
import VideocamIcon from '@mui/icons-material/Videocam';
import MicIcon from '@mui/icons-material/Mic';
import CallEndIcon from '@mui/icons-material/CallEnd';

import { useState } from 'react';
import { Link } from 'react-router-dom';

function Pannel({socket ,userStream}) {
  const [activeCam, setActiveCam] = useState(true)
  const [activeMic, setActiveMic] = useState(true)
  const [activeEnd, setActiveEnd] = useState(false)


  const toggleCAM = ()=>{
    setActiveCam(!activeCam);
    if(!activeCam){
      document.getElementById("camBtn").style.backgroundColor = "#068FFF";
    }
    else{
      document.getElementById("camBtn").style.backgroundColor = "#494F57";
    }

    const videoTrack = userStream.current.getTracks().find(track => track.kind === 'video');
    if (videoTrack.enabled) {
        videoTrack.enabled = false;
    } else {
        videoTrack.enabled = true;
    }
  }

  const toggleMIC = ()=>{
    setActiveMic(!activeMic);
    if(!activeMic){
      document.getElementById("micBtn").style.backgroundColor = "#068FFF";
    }
    else{
      document.getElementById("micBtn").style.backgroundColor = "#494F57";
    }

    const audioTrack = userStream.current.getTracks().find(track => track.kind === 'audio');
    if (audioTrack.enabled) {
      audioTrack.enabled = false;
    } else {
      audioTrack.enabled = true;
    }
  }

  const endCall = ()=>{
    setActiveEnd(!activeEnd);
    if(!activeEnd){
      document.getElementById("endBtn").style.backgroundColor = "#068FFF";
      // Stop audio and video tracks
      const audioTrack = userStream.current.getTracks().find(track => track.kind === 'audio');
      if (audioTrack) {
        audioTrack.stop();
      }
      const videoTrack = userStream.current.getTracks().find(track => track.kind === 'video');
      if (videoTrack) {
        videoTrack.stop();
      }
      document.getElementById('go-to-exit').click()
      socket.disconnect()
    }
    else{
      document.getElementById("endBtn").style.backgroundColor = "#494F57";
    }

    console.log("end call")
  }

  return (
    <div className='pannel'>
      <button id='camBtn' style={{height:"50px", width:"50px", borderRadius:"50px", backgroundColor:"#068FFF", border:"0"}} onClick={toggleCAM}><VideocamIcon style={{ color: "white" }}/></button>
      <button id='micBtn' style={{height:"50px", width:"50px", marginLeft:"20px", marginRight:"20px", borderRadius:"50px", backgroundColor:"#068FFF", border:"0"}} onClick={toggleMIC}><MicIcon style={{ color: "white" }}/></button>
      <button id='endBtn' style={{height:"50px", width:"50px", borderRadius:"50px", backgroundColor:"#494F57", border:"0"}} onClick={endCall}><CallEndIcon style={{ color: "white" }}/></button>
      <Link id='go-to-exit' to='/exit'/>
    </div>
  )
}

export default Pannel