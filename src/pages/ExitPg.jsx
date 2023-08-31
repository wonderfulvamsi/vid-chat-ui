import React from 'react'
import { Link } from 'react-router-dom';

function ExitPg() {
  return (
    <div className='pg-mainContainer'>
     <div className="the-box" style={{display:"flex", flexDirection:"column", justifyContent:"start"}}>
      <h2>You've Exited The Room</h2>
      <Link to="/login" style={{ textDecoration: "none"}}>
      <button style={{height:"40px", width:"200px"}}>HOME</button>
      </Link>
      
      </div>
    </div>
  )
}

export default ExitPg