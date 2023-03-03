const express = require("express");
const mongoose = require('mongoose');
const path = require("path")
const fs = require('fs');
const app = express();
require('dotenv').config()
// CORS  ressolved
const cors = require("cors");
// const corsOptions = {
//         origin: '*',
//         credentials: true,            //access-control-allow-credentials:true
//         // optionSuccessStatus: 200,
// }
//
app.use(cors())


//getting .env data
let port = process.env.PORT || 4000
let dbName = process.env.DB_NAME
let dbHost = process.env.DB_HOSTNAME
//

app.set("view engine", "ejs");

// MongoDB connection
let dbUrl = `${dbHost}/${dbName}?retryWrites=true&w=majority`
mongoose.connect(dbUrl,
        () => {
                console.log("DB is", mongoose.connection.readyState == 0 ? "disconnected" : mongoose.connection.readyState == 1 ? "connected" : mongoose.connection.readyState == 2 ? "connecting" : mongoose.connection.readyState == 3 ? "disconnecting" : mongoose.connection.readyState == 99 ? "uninitialized" : "facing some issue")
        })



// make files dir if already not present to store images 
const data = () => {
        let root = path.dirname(require.main.filename)
        let filePath = path.join(root, 'files')
        let isfileExist = fs.existsSync(filePath);
        console.log("isfileExist", isfileExist);
        if (!isfileExist) {
                fs.mkdir(filePath, (error) => {
                        if (error) {
                                console.log(error);
                        } else {
                                console.log("New Directory created successfully !!");
                        }
                });
        }
}
data()


// routes
const RegisterUserApi = require("./routes/RegisterUser")
const LoginApi = require("./routes/Login")
const DocumentApi = require("./routes/Document")
const DownloadDocApi = require("./routes/DownloadDoc")


app.use("/api/Register", RegisterUserApi);
app.use("/api/Login", LoginApi);
app.use("/api/Document", DocumentApi);
app.use("/api/DownloadDocument", DownloadDocApi);

//listen port
app.listen(port)
//

