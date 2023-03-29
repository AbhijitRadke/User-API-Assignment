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




const userLogin = async function (req, res) {
    try {
        let userdata = req.body

        if (!isValidBody(userdata)) return res.status(400).send({ status: false, message: "Please provide user cradentials !!!" })
        let { email, password } = userdata

        if (!email) return res.status(400).send({ status: false, message: "Email is required" })
        if (!isValidEmail(email.trim())) return res.status(400).send({ status: false, message: `This is not a valid email.` })

        if (!password) return res.status(400).send({ status: false, message: "Password is required" })

        let checkEmail = await userModel.findOne({ email: email });
        if (!checkEmail) return res.status(404).send({ status: false, message: "This user is not found Please provide a correct Email" });

        let checkPassword = await bcrypt.compare(password, checkEmail.password);   // mostly password used:- Abjhd@123/Pass@123
        if (!checkPassword) return res.status(400).send({ status: false, message: "Your password is wrong, Please enter correct password" });

        let userId = checkEmail._id
        let userToken = jwt.sign({ userId: userId.toString(), iat: Date.now() },
            'ABHIJIT', { expiresIn: "24h" }
        )
        res.setHeader("x-api-key", userToken)

        res.status(200).send({ status: true, message: "Success", userId: userId, userToken })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
}

//-------------------get user---------------------------------

const userById = async function (req, res) {

    try {

        const userId = req.params.Id
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "User id is not valid" })

        let userDetails = await userModel.findById(userId)
        if (!userDetails) return res.status(404).send({ status: false, message: "User not found" })
        if (userDetails.isDeleted) return res.status(400).send({ status: false, message: "User Is Deleated" })

        return res.status(200).send({ status: true, message: "Success", data: userDetails })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })

    }
}

const allUsers = async function (req, res) {

    try {
        let userDetails = await userModel.find({ isDeleted: false })
        if (!userDetails) return res.status(404).send({ status: false, message: "Users not found" })

        return res.status(200).send({ status: true, message: "Success", data: userDetails })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })

    }
}



const updateUser = async function (req, res) {
    try {
        let userId = req.params.Id;
        const data = req.body;

        if (!isValidBody(data) && (typeof (files) == "undefined")) return res.status(400).send({ status: false, message: "Insert Data : BAD REQUEST" });

        let { fname, lname, email, phone, password, address, pincode } = data;


        const dataToUpdate = {}
        if (fname) {
            if (!isValidName(fname.trim())) return res.status(400).send({ status: false, message: "First name is invalide" })
            dataToUpdate.fname = fname
        }

        if (lname) {
            if (!isValidName(lname.trim())) return res.status(400).send({ status: false, message: "Last Name is invalide" });
            dataToUpdate.lname = lname
        }

        if (email) {
            if (!isValidEmail(email.trim())) return res.status(400).send({ status: false, message: "Provide a valid email id" });
            const findEmail = await userModel.findOne({ email: email });
            if (findEmail) return res.status(409).send({ status: false, message: "email id already exist" });
            dataToUpdate.email = email
        }

        if (phone) {
            if (!isValidPhone(phone)) return res.status(400).send({ status: false, message: "Invalid phone number" });
            const checkPhone = await userModel.findOne({ phone: phone });
            if (checkPhone) return res.status(409).send({ status: false, message: "phone number already exist" });
            dataToUpdate.phone = phone
        }

        if (password) {
            if (!isVaildPass(password.trim())) return res.status(400).send({ status: false, message: "Password should be Valid min 8 character and max 15 " })
            password = await bcrypt.hash(password, 10)
            dataToUpdate.password = password
        }


        if (address) {
            dataToUpdate.address = address
        }
        if (pincode) {
            if (!isValidpincode(pincode)) return res.status(400).send({ status: false, message: "Pinecode is not valide" })
            dataToUpdate.pincode = pincode
        }

        let updateData = await userModel.findOneAndUpdate({ _id: userId },
            { $set: dataToUpdate }
            , { new: true });

        return res.status(200).send({ status: true, message: "Success", data: updateData });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}


const deleteUserById = async function (req, res) {
    try {
        let userId = req.params.Id;

        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Invalid Useridid" })

        const userData = await userModel.findById(userId)
        if (!userData) return res.status(404).send({ status: false, message: "No details exists with this userId" })

        if (userData.isDeleted) return res.status(404).send({ status: false, message: "User not found (already deleted)" })

        let deleteUser = await userModel.findOneAndUpdate({ _id: userId }, { $set: { isDeleted: true } }, { new: true })

        res.status(200).send({ status: true, message: "Success", data: deleteUser })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}

module.exports = { userLogin, userById, userCreate, updateUser, allUsers, deleteUserById }
