import React, { useState, useEffect } from 'react';
import Msg from '../components/Msg'
import ScrollToBottom from "react-scroll-to-bottom";
import axios from 'axios'
import {useToken} from '../TokenContext';

function ChatBar({socket, roomid, username}) {
  const url = "http://localhost:3002";
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [userSocketID, setUserSocketID] = useState('');
  const { access, setAccess, refresh, setRefresh } = useToken();

  //send msg
  const sendMsg = async (messageData)=>{
    try{
        await socket.emit("send_msg", messageData);
    }
    catch(err){
        console.log("Couldn't send msg", err);
    }
  }
  const handleSendMessage = async () => {
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

          try{
            await axios.post(url+"/room/"+roomid+"/"+username+"/send_message",{
                msg: messageData,
                "authorization": `Bearer ${access}`,}
                )
          }
          catch(err){
                console.log("token expired", err)
                try{
                    //token expired 
                const re_response = await axios.post(url+"/auth/jwt/refresh",{
                    token : refresh
                })
                console.log("refreshing", re_response)
                    setAccess(re_response.data.accessToken)
                    setRefresh(re_response.data.refreshToken)
                    console.log("Sucessfull refreshed!")
                    const f = await axios.post(url+"/room/"+roomid+"/"+username+"/send_message",{
                            msg: messageData,
                            "authorization": `Bearer ${re_response.data.accessToken}`,
                        }
                    )
                    console.log("yay!", f)
                }
                
                catch(err){
                    alert("Login Again!");
                }
          }

          
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

  useEffect(()=>{
    const getPrevMsgs = async()=>{
        try{
            const f = await axios.post(url+"/room/"+roomid+"/"+username+"/get_messages",
            {
                "authorization": `Bearer ${access}`,
            }
            )
            setMessages(f.data);
        }
        catch(err){
            try{
            //token expired 
            const re_response = await axios.post(url+"/auth/jwt/refresh",{
                token : refresh
            })
            console.log("refreshing", re_response)
            setAccess(re_response.data.accessToken)
                setRefresh(re_response.data.refreshToken)
                console.log("Sucessfull refreshed!")
                const f = await axios.post(url+"/room/"+roomid+"/"+username+"/get_messages",{
                    "authorization": `Bearer ${re_response.data.accessToken}`,
                })
                console.log("fucked", f)
                setMessages(f.data);
            }
            catch(err){
                alert("Login Again!");
            }
        }
    } 
    getPrevMsgs();
  },[]);

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