const express = require("express");
const bodyparser = require('body-parser');
const jwt = require('jsonwebtoken');
jwtKey = "jwt";



const RegisterUserRoute = express.Router();
RegisterUserRoute.use(bodyparser.json());
const RegisterUser_S = require('../schema/RegisterUserSchema')


RegisterUserRoute.post('/', async (req, res) => {
    const RegisterUserData = new RegisterUser_S({
        UserName: req.body.username,
        Password: req.body.password
    });

    try {
        const UserNameAlreadyExisted = await RegisterUser_S.findOne({ UserName: RegisterUserData.UserName })
        if (UserNameAlreadyExisted != null) {
            res.json({SUCCESS: false,  MESSAGE:"Username is already taken ! Please choose different Username." });
        } else {
            let User = await RegisterUser_S.find()
            if (User.length > 0) {
                let lastUser = User[User.length - 1]
                Object.assign(RegisterUserData, { UserId: lastUser.UserId + 1 });

            } else {
                Object.assign(RegisterUserData, { UserId: 1 });
            }
            const finaldata = await RegisterUserData.save()

            let TokenData = {
                "_id": finaldata._id,
                "UserName": finaldata.UserName,
                "UserId": finaldata.UserId
            }
            let TOKEN;
            jwt.sign(TokenData, jwtKey, (err, token) => {
                TOKEN = token
            })
            const UserData = await RegisterUser_S.findOne({ _id: finaldata._id }, { _id: 0, __v: 0, Password: 0 })
            let UserInfo = UserData
            console.log("UserInfo", UserInfo);
            UserInfo = { ...UserInfo._doc, TOKEN: TOKEN }
            let Data = { SUCCESS: true, DATA: UserInfo }
            res.json(Data);
        }
    } catch (err) {
        res.json({SUCCESS: false,  MESSAGE:err  })
    }
})

module.exports = RegisterUserRoute; 