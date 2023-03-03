import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Files from './components/Files';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState({status:false});


  useEffect( ()=>{
    let token =  localStorage.getItem("Token")
    if(token==null){
      console.log("tokentokenhere",token);

      let loginStatus=isLoggedIn;
      loginStatus.status=false
      setIsLoggedIn({...loginStatus})
    }else{
      let loginStatus=isLoggedIn;
      loginStatus.status=true
      setIsLoggedIn({...loginStatus})    }
  },[])
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={isLoggedIn?.status ? <Navigate to="/filemanager" /> : <Navigate to="/login" />} />
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/signup' element={<Signup/>}></Route>
          <Route path='/filemanager' element={<Files setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn}/>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
