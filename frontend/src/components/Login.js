import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Login.css';
import { URLData } from '../HTTP/http'
import Modal from 'react-modal';

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setmsg] = useState('');
  const [modalIsOpen, setIsOpen] = useState(false);
  let navigate = useNavigate();


  useEffect(() => {
    let token = localStorage.getItem("Token")
    if (token != null) {
      navigate('/filemanager')
    }
  }, [])

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
  const handleLogin = () => {
    const body = {
      username: userName,
      password: password
    }

    fetch(URLData.Login, {
      method: 'POST',
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(body),
    })
      .then(response => response.json())
      .then(res => {
        console.log(res);
        if (res.SUCCESS == true) {
          localStorage.setItem("Token", JSON.stringify(res.DATA.TOKEN));
          localStorage.setItem("UserId", JSON.stringify(res.DATA.UserId));
          localStorage.setItem("Username", JSON.stringify(res.DATA.UserName));
          navigate('/filemanager')

        } else {
          setmsg("Invalid Credentials!")
          openModal(true)

        }

      })
      .catch(error => {
        setmsg("Something went wrong !")
        openModal(true)

      });

  }


  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin()
    console.log(`Email: ${userName} Password: ${password}`);
    setPassword('');
    setUserName('')
  };


  return (
    <>
      <div className="login-container">
        <form className="login-form" style={{width:"30%"}} onSubmit={handleSubmit}>
          <h1>Login</h1>
          <label style={{textAlign:"start", paddingBottom:"8px"}}>User Name:</label>
          <input
            placeholder="Enter User Name"
            value={userName}
            onChange={handleUserNameChange}
            required
          />
          <label style={{textAlign:"start", paddingBottom:"8px"}}>Password:</label>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <button type="submit" style={{ marginBottom: 25 }}>Submit</button>
          <Link to="/signup">Sign UP</Link>
        </form>
      </div>
      <Modal
        isOpen={modalIsOpen}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div style={{ display: "flex", float: "right" }}>
          <button style={{ backgroundColor: "red", justifyContent: "right" }} onClick={closeModal}>x</button>

        </div>
        <div style={{ marginTop: 50, marginBottom: 50, flexDirection: "column", display: "flex" }}>
          <text style={{ textAlign: "center", margin: "25px 50px " }}>{msg}</text>
        </div>

      </Modal>
    </>
  );
};

export default Login;
