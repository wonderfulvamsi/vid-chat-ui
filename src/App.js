import './App.css';
import LandingPg from './pages/LandingPg';
import ChatPg from './pages/ChatPg';
import LoginPg from './pages/LoginPg';
import SignupPg from './pages/SignupPg'
import ExitPg from './pages/ExitPg';

import { Route, Routes } from 'react-router-dom';
import Dummy from './pages/Dummy';

import { TokenProvider } from './TokenContext';

function App() {
  return (
    <div>
      <TokenProvider>
        <Routes>
          <Route path = '/login' Component={LoginPg}/>
          <Route path = '/signup' Component={SignupPg}/>
          <Route path = '/home' Component={LandingPg}/>
          <Route path='/chatroom/:roomid/:username' Component={ChatPg} /> 
          <Route path='/dummy' Component={Dummy}/>
          <Route path = '/exit' Component={ExitPg}/>
        </Routes>
      </TokenProvider>
    </div>
  );
}

export default App;
