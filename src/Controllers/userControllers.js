const userModel = require('../models/userModel')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const validator = require("../Validators/validator")
const mongoose = require("mongoose")
const { isValidObjectId } = mongoose

const { isEmpty, isValidName, isValidEmail, isValidPhone, isValidBody, isValidpincode, isVaildPass } = validator


const userCreate = async function (req, res) {
    try {

        let data = req.body
        let { fname, lname, email, phone, password, address, pincode } = data

        if (!fname) return res.status(400).send({ status: false, message: "fname is requires" })
        if (!isValidName(fname.trim())) return res.status(400).send({ status: false, message: `${fname} is not a valide first name.` })

        if (!lname) return res.status(400).send({ status: false, message: "lname is requires" })
        if (!isValidName(lname.trim())) return res.status(400).send({ status: false, message: `${lname} is not a valide last name.` })


        if (!email) return res.status(400).send({ status: false, message: "email is requires" })
        if (!isValidEmail(email.trim())) return res.status(400).send({ status: false, message: `${email} is not a valide email.` })
        const isEmailAlreadyUsed = await userModel.findOne({ email })
        if (isEmailAlreadyUsed) { return res.status(409).send({ status: false, message: `${email} is already in use, Please try a new email.` }) }
        // if resource is already presend in DB then we use 409 status code

        if (!phone) return res.status(400).send({ status: false, message: "phone is required" })
        if (!isValidPhone(phone)) return res.status(400).send({ status: false, message: `${phone} is not a valide phone.` })
        const isPhoneAlreadyUsed = await userModel.findOne({ phone })
        if (isPhoneAlreadyUsed) { return res.status(409).send({ status: false, message: `${phone} is already in use, Please try a new phone number.` }) }


        if (!password) return res.status(400).send({ status: false, message: "password is required" })
        if (!isVaildPass(password.trim())) return res.status(400).send({ status: false, message: "Please provide a valid Password with min 8 to 15 char with Capatial & special (@#$%^!) char " })



        if (!address) return res.status(400).send({ status: false, message: "address is required" })
        if (!(pincode)) return res.status(400).send({ status: false, message: " pincode Required" })
        if (!isValidpincode(pincode)) return res.status(400).send({ status: false, message: "Pinecode is not valide" })


        const encryptedPassword = await bcrypt.hash(password, 10) //encrypting password by using bcrypt. // 10 => salt sound

        //object destructuring for response body.
        const userData = { fname, lname, email, phone, password: encryptedPassword, address, pincode }
        const saveUserData = await userModel.create(userData);

        res.status(201).send({ status: true, message: "Success", data: saveUserData });

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}



module.exports = { userCreate }
