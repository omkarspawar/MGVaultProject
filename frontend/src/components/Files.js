import React, { useEffect, useState } from 'react'
import './Files.css';
import DataTable from 'react-data-table-component';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { URLData } from '../HTTP/http';

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

const Files = ({ setIsLoggedIn, isLoggedIn }) => {

  const [modalIsOpen, setIsOpen] = useState(false);
  const [alertmodalIsOpen, setalertIsOpen] = useState(false);
  const [deletemodalIsOpen, setdeletemodalIsOpen] = useState(false);
  const [uploadmodalIsOpen, setuploadmodalIsOpen] = useState(false);
  const [sixDigitCode, setsixDigitCode] = useState("");
  const [DocId, setDocId] = useState("");
  const [DocName, setDocName] = useState("");
  const [msg, setmsg] = useState('');
  const [userData, setuserData] = useState({
    token: "",
    userID: "",
    userName: ""
  });


  const [file, setFile] = useState(null);
  const [AllFileData, setAllFileData] = useState([])
  let navigate = useNavigate();

  useEffect(() => {
    let token = JSON.parse(localStorage.getItem("Token"))
    let userID = JSON.parse(localStorage.getItem("UserId"))
    let userName = JSON.parse(localStorage.getItem("Username"))
    setuserData({
      token: token,
      userID: userID,
      userName: userName
    })
    handleGetAllFile(token)

  }, [])



  const openModal = () => {
    setIsOpen(true);
  }
  const afterOpenModal = () => {

  }
  const opendeletemodalIsOpen = () => {
    setdeletemodalIsOpen(true)
  }
  const openuploademodalIsOpen = () => {
    setuploadmodalIsOpen(true)

  }
  const openAlertModal = () => {
    setalertIsOpen(true);
  }
  const closeuploadModal = () => {
    setuploadmodalIsOpen(false);

  }
  const closeModal = () => {
    setIsOpen(false);
  }
  const closeDeleteModal = () => {
    setdeletemodalIsOpen(false)

  }
  const closeAlertModal = () => {
    setalertIsOpen(false);
    handleGetAllFile(userData?.token)

  }

  const copylink = (linkText) => {
    navigator.clipboard.writeText(linkText)
    setmsg("Link Copied Successfully!")
    openAlertModal()
  }


  const handleLogout = () => {
    localStorage.removeItem("Token")
    localStorage.removeItem("UserId")
    localStorage.removeItem("Username")
    let isloggingStatus = isLoggedIn;
    isloggingStatus.status = false
    setIsLoggedIn({ ...isloggingStatus })
    navigate('/')
  }

  const handleFileChange = (e) => {
    console.log("file data", e.target.files[0]);
    setFile(e.target.files[0]);
  };

  const handlePostFile = () => {
    try {
      var formdata = new FormData();
      formdata.append("file", file);

      fetch(URLData.UploadNewFile, {
        method: 'POST',
        headers: new Headers({
          "Authorization": "Bearer " + userData.token
        }),
        body: formdata,
      })
        .then(response => response.json())
        .then(result => {
          closeuploadModal()

          console.log(result)
          if (result.SUCCESS == true) {
            setmsg(result.MESSAGE)
            openAlertModal()

          } else {
            setmsg("Somethig went wrong!")
            openAlertModal()

          }

        })
        .catch(error => {
          console.log('error', error)
          setmsg("Something went wrong!")
          openAlertModal()

        });
    } catch (error) {
      console.log("err", error);
      setmsg("Something went wrong!")
      openAlertModal()

    }
  }

  const handleDocDownload = (docIdval, docNameval) => {
    setsixDigitCode("")
    setDocId(docIdval);
    setDocName(docNameval);
    openModal();
  }

  const DownloadDoc = () => {
    const body = {
      documentId: DocId,
      secretCode: sixDigitCode
    }
    fetch(URLData.DownloadFile, {
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
          closeModal()
          setmsg("Verified Successfully!")
          openAlertModal()
          const downloadFile = (url, fileName) => {
            console.log("k", url, fileName);
            fetch(url)
              .then(response => response.blob())
              .then(blob => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
              });
          }
          downloadFile(res.URL, DocName)
          // ***********local data cannot be fetch so to test comment upper line and uncomment below line******************
          // downloadFile("https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*",DocName)

        } else {
          closeModal()
          setmsg("Invalid Credentials!")
          openAlertModal()

        }

      })
      .catch(error => {
        closeModal()
        setmsg("Invalid Credentials!")
        openAlertModal()
      });
  }

  const handleGetAllFile = (token) => {
    try {
      fetch(URLData.GetorDeleteFiles, {
        method: 'GET',
        headers: new Headers({
          "Authorization": "Bearer " + token
        }),
      })
        .then(response => response.json())
        .then(result => {
          if (result.SUCCESS == true) {
            let filedata = []
            result.DATA.map((i) => {
              filedata.push({
                img: <img src={require("../image/file2.png")} alt="A beautiful image" style={{ width: "40px" }} />,
                name: i.DocumentName,
                id: i._id,
                docUrl: i.DocumentUrl,
                directUrl: URLData.DirectDownloadDoc + "/" + i._id,
              })
            })
            setAllFileData(filedata)
          }


          // console.log("handleGetFile", result)

        })
        .catch(error => {
          console.log('error', error)
        });
    } catch (error) {
      console.log("err", error);
    }
  }

  const HandleDeleteDoc = (docIdval) =>{
    setDocId(docIdval);
    opendeletemodalIsOpen()
  }

const DeleteDoc = () =>{
  let body={
    id:DocId
  }
  console.log("body",userData.token);
  try {
    fetch(URLData.GetorDeleteFiles, {
      method: 'DELETE',
      headers: new Headers({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + userData.token
      }),
      body: JSON.stringify(body),

    })
      .then(response => response.json())
      .then(result => {
        console.log("delete", result)

        if (result.SUCCESS == true) {
          closeDeleteModal()
          setmsg("Document deleted Successfully!!")
          openAlertModal()
        }
      })
      .catch(error => {
        console.log('error', error)
      });
  } catch (error) {
    console.log("err", error);
  }
}


  const columns = [
    {
      name: "",
      selector: row => row.img
    },
    {
      name: "",
      selector: row => row.name
    },
    {
      name: "",
      cell: row => <button onClick={() => copylink(row.directUrl)} style={{ width: 120, fontSize: 15 }}>COPY LINK</button>
    },
    {
      name: "",
      cell: row => <button onClick={() => handleDocDownload(row.id, row.name)} style={{ width: 150, fontSize: 15, backgroundColor: "#74AEC2" }}>DOWNLOAD</button>
    },
    {
      name: "",
      cell: row => <button onClick={()=>HandleDeleteDoc(row.id)} style={{ width: 150, fontSize: 15, backgroundColor: "red" }}>DELETE</button>
    },

  ]

  return (
    <>
      <div className='login-container2' style={{}}>
        <div style={{ height: 50, backgroundColor: "#74AEC2", width: "100%", flexDirection: "row", justifyContent: "space-between", display: 'flex', alignItems: "center", paddingRight: 25, paddingLeft: 25 }}>
          <div>MG Vault</div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ paddingRight: 20 }}>
              {userData.userName}
            </div>
            <button onClick={handleLogout} style={{ marginRight: 50 }} type="">Log Out</button>
          </div>
        </div>
        <div style={{ margin: 30, textAlign: "end" }}>
          <button style={{ backgroundColor: "#74AEC2", justifyContent: "right" }} onClick={openuploademodalIsOpen}>Add New File</button>
        </div>
        <div style={{ margin: 30, border: "0px solid black" }}>
          <DataTable columns={columns} data={AllFileData}></DataTable>
        </div>

      </div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div style={{ display: "flex", float: "right" }}>
          <button style={{ backgroundColor: "red", justifyContent: "right" }} onClick={closeModal}>x</button>

        </div>
        <div style={{ marginTop: 50, marginBottom: 50, flexDirection: "column", display: "flex" }}>
          <p >Enter 6 digit secret code</p>
          <input style={{ borderWidth: "2px", borderColor: "black", outlineColor: "red", backgroundColor: "#74AEC2", marginTop: "10px" }} type="text" onChange={e => setsixDigitCode(e.target.value)}></input>
        </div>
        <div style={{ textAlign: "center" }}>


          <button onClick={DownloadDoc}>Confirm</button>
        </div>
      </Modal>
      <Modal
        isOpen={deletemodalIsOpen}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div style={{ display: "flex", float: "right" }}>
          <button style={{ backgroundColor: "red", justifyContent: "right" }} onClick={closeDeleteModal}>x</button>

        </div>
        <div style={{ marginTop: 50, marginBottom: 50, flexDirection: "column", display: "flex" }}>
          <p >Please Confirm Delete</p>
        </div>
        <div style={{ textAlign: "center" }}>


          <button onClick={DeleteDoc} >Confirm</button>

        </div>
      </Modal>
      <Modal
        isOpen={uploadmodalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeuploadModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div style={{ display: "flex", float: "right" }}>
          <button style={{ backgroundColor: "red", justifyContent: "right" }} onClick={closeuploadModal}>x</button>

        </div>
        <div style={{ marginTop: 50, marginBottom: 50, flexDirection: "column", display: "flex" }}>
          <div style={{ marginTop: 50, marginBottom: 50, flexDirection: "column", display: "flex" }}>
            <p >Please Add File To Upload</p>
            <input style={{ borderWidth: "2px", borderColor: "black", outlineColor: "red", backgroundColor: "#74AEC2", marginTop: "10px", }} type="file" onChange={handleFileChange}></input>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <button onClick={handlePostFile}>Upload</button>
        </div>
      </Modal>
      <Modal
        isOpen={alertmodalIsOpen}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeAlertModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div style={{ display: "flex", float: "right" }}>
          <button style={{ backgroundColor: "red", justifyContent: "right" }} onClick={closeAlertModal}>x</button>

        </div>
        <div style={{ marginTop: 50, marginBottom: 50, flexDirection: "column", display: "flex" }}>
          <p style={{ textAlign: "center", margin: "25px 50px " }}>{msg}</p>
        </div>

      </Modal>
    </>
  )
}

export default Files