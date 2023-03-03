const express = require("express")
const bodyparser = require('body-parser')
const jwt = require('jsonwebtoken');
jwtKey = "jwt";

const LoginRoute = express.Router();
LoginRoute.use(bodyparser.json());

const RegisterUser_S = require('../schema/RegisterUserSchema')


LoginRoute.post('/', async (req, res) => {
    const LoginData = {
        UserName: req.body.username,
        Password: req.body.password
    };
    try {
        const UserNameused = await RegisterUser_S.findOne({ UserName: LoginData.UserName })

        if (UserNameused != null) {
            try {
                if (UserNameused.Password === LoginData.Password) {
                    let TokenData = {
                        "_id": UserNameused._id,
                        "UserName": UserNameused.UserName,
                        "UserId": UserNameused.UserId
                    }
                    let TOKEN;

                    jwt.sign(TokenData, jwtKey, (err, token) => {
                        TOKEN = token
                    })
                    const UserData = await RegisterUser_S.findOne({ _id: UserNameused._id }, { _id: 0, __v: 0, Password: 0 })
                    res.json({ SUCCESS: true, DATA: { ...UserData._doc, TOKEN: TOKEN } });
                } else {
                    res.json({ SUCCESS: false, message: "Invalid credentials" });
                }
            } catch (err) {
                res.json({ SUCCESS: false, message: "Something Went Wrong" })
            }
        } else {
            res.json({SUCCESS: false, message: "No user found with this Email" });
        }
    } catch (err) {
        res.json({ SUCCESS: false, message: "Something Went Wrong" })
    }
})

module.exports = LoginRoute;
