import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {useToken} from '../TokenContext';
import axios from 'axios';

function SignupPg() {
    const { access, setAccess, refresh, setRefresh } = useToken();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [warning, setWarning] = useState("none")
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const url = "http://localhost:3002"
      if (email && password) {
        try {
          const response = await axios.post(url+'/auth/signup', { email, password });
          //console.log('Signup successful:', response.data);
          setAccess(response.data.accesstoken);
          setRefresh(response.data.refreshtoken);
          setWarning("none")
          document.getElementById('go-to-home').click();

        } catch (error) {
          console.error('Signup failed:', error);
          setWarning("block");
        }
      }
    };
  
    return (
      <div className='pg-mainContainer'>
       <div className="the-box">
        <h2 style={{marginBottom:0}}>Sign Up</h2>
        <p style={{color:"red", display: warning}}>This email id is already registered</p>
        <form style={{marginTop:"-25px", height:"200px", display:"flex", flexDirection: "column", justifyContent:"space-evenly"}} onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter Email Id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">SIGN UP</button>
        </form>
        <Link id='go-to-home' to='/home'/>
        <Link to="/login">Already have an account? Log In here</Link>
        </div>
      </div>
    );
  }

export default SignupPg