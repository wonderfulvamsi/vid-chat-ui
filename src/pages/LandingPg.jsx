import React, { useState } from 'react';
import { Link } from 'react-router-dom';


function LandingPg() {
  const [name, setName] = useState('');
  const [roomid, setRoomid] = useState('');

  const handleSubmit = (e) => {
    document.getElementById('go-to-chatpg').click();
  };


  return (
    <div className='pg-mainContainer'>
     <div className="the-box">
      <h2 style={{marginBottom:0}}>Google Meet Clone</h2>
      <form style={{marginTop:"-100px", height:"200px", display:"flex", flexDirection: "column", justifyContent:"space-evenly"}} onSubmit={handleSubmit}>
        <input
          type="Name"
          placeholder="Enter User Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="roomid"
          placeholder="Enter Room Id"
          value={roomid}
          onChange={(e) => setRoomid(e.target.value)}
        />
        <Link id='go-to-chatpg' to={"/chatroom/" + roomid+ "/" + name }/>
        <button type="submit">JOIN</button>
        
      </form>
      </div>
    </div>
  );
}


export default LandingPg