const express = require("express")
const bodyparser = require('body-parser')
const jwt = require('jsonwebtoken');
jwtKey = "jwt";
const multer = require('multer')
const path = require("path")
const fs = require('fs');


const DocumentDetailsRoute = express.Router();
DocumentDetailsRoute.use(bodyparser.json());

const DocumentDetail_S = require('../schema/DocumentDetails');
const { VerifyCode } = require("../middlewares/middlewares");


const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "files");
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
        }
    })
});


DocumentDetailsRoute.post('/upload', upload.single("file"), async (req, res) => {

    console.log({ req });
    try {
        const usertoken = req.headers.authorization;
        const token = usertoken.split(' ');
        const decoded = jwt.verify(token[1], jwtKey);
        const SecretCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        let root = path.dirname(require.main.filename)
        const filePath = path.join(root, req.file.path)
        const Document = new DocumentDetail_S({
            UserId: decoded.UserId,
            DocumentName: req.file.filename,
            DocumentUrl: filePath,
            DocumentPassword: SecretCode,
        });
        const finaldata = await Document.save()
        return res.status(200).json({ SUCCESS: true, MESSAGE: `File Uploaded Successfully! Use ${SecretCode} as a secret code to download this file.` }
        )
    } catch (err) {
        console.log(err)
    }
})
DocumentDetailsRoute.get('/', async (req, res) => {
    try {
        const usertoken = req.headers.authorization;
        const token = usertoken.split(' ');
        const decoded = jwt.verify(token[1], jwtKey);

        const AllDocuments = await DocumentDetail_S.find({ UserId: decoded.UserId }, { DocumentPassword: 0 })

        res.json({ SUCCESS: true, DATA: AllDocuments })

    } catch (err) {
        console.log(err)
    }
})




DocumentDetailsRoute.post('/downloadDocument', VerifyCode, async (req, res) => {
    try {
        const documentID = req.body.documentId
        const VerificationCode = req.body.secretCode
        const AllDocuments = await DocumentDetail_S.findById(documentID)
        res.send({ SUCCESS: true, URL: AllDocuments.DocumentUrl })
    } catch (err) {
        console.log(err)
    }
})



DocumentDetailsRoute.delete('/', async (req, res) => {
    try {
        const usertoken = req.headers.authorization;
        const token = usertoken.split(' ');
        const decoded = jwt.verify(token[1], jwtKey);

        const Documentid = req.body.id

        const AllDocuments = await DocumentDetail_S.findById(Documentid, async function (err, docs) {
            if (err) {
                console.log(err);
            }
            else {
                if (docs?.UserId == decoded.UserId) {
                    let deletedData = await DocumentDetail_S.findByIdAndDelete(Documentid)
                    fs.unlinkSync(docs?.DocumentUrl);
                    res.send({SUCCESS:true, DATA:deletedData})
                } else {
                    res.send("Something went wrong!")

                }

            }
        })



    } catch (err) {
        console.log(err)
    }
})

module.exports = DocumentDetailsRoute;
