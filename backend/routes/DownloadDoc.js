const express = require("express")
const bodyparser = require('body-parser')
const jwt = require('jsonwebtoken');
jwtKey = "jwt";
const multer = require('multer')
const path = require("path")
const fs = require('fs');
const DownloadDocRoute = express.Router();
const DocumentDetail_S = require('../schema/DocumentDetails');
const { VerifyCode } = require("../middlewares/middlewares");

DownloadDocRoute.use(bodyparser.json());

DownloadDocRoute.get('/:DocumentId', async (req, res) => {
    let DocumentIdData = req.params.DocumentId
    res.render('index', { DocumentIdData: DocumentIdData });
})


DownloadDocRoute.post('/verifyCode',VerifyCode, async (req, res) => {
    try {
        let DocumentIdData = req.body.documentId
        let secretCode = req.body.secretCode
        const AllDocuments = await DocumentDetail_S.findById(DocumentIdData)
        res.send({ SUCCESS: true, URL: AllDocuments.DocumentUrl, DOCNAME:AllDocuments.DocumentName })
    } catch (err) {
        console.log(err)
    }
})



module.exports = DownloadDocRoute;
