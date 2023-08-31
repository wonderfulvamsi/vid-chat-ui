import React, { useState, useEffect } from 'react';
import Msg from '../components/Msg'
import ScrollToBottom from "react-scroll-to-bottom";

function ChatBar({socket, roomid, username}) {

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [userSocketID, setUserSocketID] = useState('');

  //send msg
  const sendMsg = async (messageData)=>{
    try{
        await socket.emit("send_msg", messageData);
    }
    catch(err){
        console.log("Couldn't send msg", err);
    }
  }
  const handleSendMessage = () => {
      if (inputText !== "") {
          const messageData = {
              roomid: roomid,
              author: username,
              message: inputText,
              time:
                  new Date(Date.now()).getHours() +
                  ":" +
                  new Date(Date.now()).getMinutes(),
          };
          sendMsg(messageData);
          setMessages((list) => [...list, messageData]);
          setInputText("");
        }
      }
  
  // Join the room 
  const joinRoom = async ()=>{
    try{
        await socket.emit('join_room', {"roomid": roomid});
    }
    catch(err){
        console.log("Couldn't join the room!",err)
    }
  }

  // Listen to the messages continously && Rejoin the room if socketId is changed
  useEffect(() => {
    socket.on("receive_msg", (data) => {
            setMessages((list) => [...list, data]);
    });
    console.log("checking ids", userSocketID,  socket.id)
    if(userSocketID && userSocketID == socket.id){
        // do noting
    }
    else{
        console.log("join room called!")
        joinRoom();
        setUserSocketID(socket.id);
    }
  }, [socket]);

  return (
    <div className="chatbar">
          < div className="chat-window-wrapper" >
              <div className="chat-window">
                    <div className="chat-body">
                              <ScrollToBottom className="message-container">
                                  {messages.map((messageContent, i) => {
                                      return (
                                          <Msg username={username} messageContent={messageContent} key={i} />
                                      );
                                  })}
                              </ScrollToBottom>
                    </div>
                    <p style={{font: "caption", margin:"5px", padding:"5px", color:"#848484", textAlign: "center"}}>In call instant messaging </p>
                    <div className="chat-footer">
                              <input
                                  id='inputArea'
                                  type="text"
                                  value={inputText}
                                  placeholder="Enter your msg here..."
                                  onChange={(event) => {
                                      setInputText(event.target.value);
                                  }}
                              />
                              <button onClick={handleSendMessage}>&#9658;</button>
                    </div>

                </div>
            </div>
    </div>
    );
}

export default ChatBar