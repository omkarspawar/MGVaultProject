import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { URLData } from "../HTTP/http";
import './Login.css';
import Modal from 'react-modal';


const Signup = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [msg, setmsg] = useState('');
    const [modalIsOpen, setIsOpen] = React.useState(false);
    let navigate = useNavigate(); 
  
    const customStyles = {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
      },
    };
  
    function openModal() {
      setIsOpen(true);
    }
    function closeModal() {
      setIsOpen(false);
    }
  
    const handleUserNameChange = (e) => {
      setUserName(e.target.value);
    };
  
    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
      };
  

    const handleRegistration = () =>{

      const body = {
        username:userName,
        password:password
      }
      
      fetch(URLData.Register, {
        method: 'POST',
        headers: new Headers({
          "Content-Type": "application/json"
        }),
        body: JSON.stringify(body) ,
      })
        .then(response => response.json())
        .then(result =>{
          console.log(result)
          if(result.SUCCESS==true){
            setmsg("Account Created Successfully!")
            openModal()
          }else{
            setmsg(result.MESSAGE)
            openModal()
          }
          })
        .catch(error => console.log('error', error));
    }


    const handleSubmit = (e) => {
      e.preventDefault();
      if(userName != "" && password != "" && confirmPassword != ""){
        if(password==confirmPassword){
          handleRegistration()
        }else{
          setmsg("Password and Confirm Password should be same!")
          openModal()
        }
      }else{
        setmsg("Please fill all the fields")
        openModal()
      }
      console.log(`Email: ${userName} Password: ${password}`);
      setUserName('');
      setPassword('');
      setConfirmPassword('');
    };

  

  return (
    <>
    <div className="login-container" >
      <form className="login-form" style={{width:"30%"}} onSubmit={handleSubmit}>
        <h1>Register</h1>
        <label style={{textAlign:"start", paddingBottom:"8px"}}>User Name:</label>
        <input
          type="text"
          placeholder="Enter UserName"
          value={userName}
          onChange={handleUserNameChange}
          required
        />
        <label  style={{textAlign:"start", paddingBottom:"8px"}}>Password:</label>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <label  style={{textAlign:"start", paddingBottom:"8px"}}>Confirm Password:</label>
        <input
          type="password"
          placeholder="Re-enter Password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          required
        />
        <button type="submit" style={{marginBottom:25}}>Submit</button>
      <Link to="/login">Login</Link>
      </form>
    </div>
    <Modal
    isOpen={modalIsOpen}
    // onAfterOpen={afterOpenModal}
    onRequestClose={closeModal}
    style={customStyles}
    contentLabel="Example Modal"
  >
    <div style={{ display: "flex", float: "right"}}>
      <button style={{ backgroundColor: "red", justifyContent: "right" }} onClick={closeModal}>x</button>

    </div>
    <div style={{ marginTop: 50, marginBottom: 50, flexDirection: "column", display: "flex" }}>
      <text style={{textAlign:"center", margin: "25px 50px "}}>{msg}</text>
    </div>
   
  </Modal>
  </>

  );
};

export default Signup;
