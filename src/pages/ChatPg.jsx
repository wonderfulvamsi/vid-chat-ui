import React, { useEffect, useState } from 'react'
import VideoRoom from '../components/VideoRoom'
import ChatBar from '../components/ChatBar'
import Pannel from '../components/Pannel'
import { useRef } from 'react'

import { useParams } from 'react-router-dom'
import io from "socket.io-client";

import { Link } from 'react-router-dom'
const url = "http://localhost:3001"

function ChatPg() {
  const { roomid, username } = useParams(); //Note: param name must match!
  const userStream = useRef(); // This shall be shared among the video room & the pannel
  const socket =  io.connect(url)

  return (
    <div className='chat-pg-mainContainer'>
      <div className="chat-pg-left">
        <div className="chat-pg-left-top">
          <VideoRoom socket = {socket} roomid = {roomid} username = {username} userStream = {userStream}/>
        </div>
        <div className="chat-pg-right-bottom">
          <Pannel socket = {socket} userStream = {userStream} />
        </div>
      </div>
      <div className='chat-pg-right'>
        <ChatBar socket = {socket} roomid = {roomid} username = {username}/>
      </div>
      <Link to='/exit' id='go-to-exit'/>
    </div>
  )

}

export default ChatPg