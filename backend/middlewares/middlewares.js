const DocumentDetail_S= require('../schema/DocumentDetails');

 
 const VerifyCode = async (req, res, next) => {
    try {
        const documentID = req.body.documentId
        const VerificationCode = req.body.secretCode
        console.log("VerificationCode", VerificationCode)

        const AllDocuments = await DocumentDetail_S.findById(documentID)
        if (VerificationCode) {
            if (AllDocuments?.DocumentPassword == VerificationCode) {
                next()
            } else {
                res.send({SUCCESS:false, MESSAGE: "Verification code doesn't match!", })
            }
        } else {
            res.send({SUCCESS:false, MESSAGE:"please enter verification code", })

        }



    } catch (err) {
        console.log(err)
    }
}

module.exports = {VerifyCode}