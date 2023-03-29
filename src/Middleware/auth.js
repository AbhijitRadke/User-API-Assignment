const jwt = require('jsonwebtoken')
const { isValidObjectId } = require('mongoose')
const userModel = require('../models/userModel')



const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) return res.status(400).send({ status: false, msg: "token must be present in header" })

        jwt.verify(token, 'ABHIJIT', function (err, decodedToken) {
            if (err) return res.status(401).send({ status: false, msg: "invalid Token " })

            req.decodedToken = decodedToken
            next()
        })
    } catch (err) {
        return res.status(500).send({ msg: err.message })
    }
}

//----------------Authorization------------------//

const authorization = async function (req, res, next) {
    try {
        let userLoggedIn = req.decodedToken;
        let userId = req.params.Id;


        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "userId is invalid" });
        const userData = await userModel.findById(userId)
        if (!userData) return res.status(404).send({ status: false, msg: "user not Found in Database" })
        if (userData.isDeleted) return res.status(400).send({ status: false, msg: "user is allrady deleated form Database" })


        if (userId !== userLoggedIn.userId) return res.status(403).send({ status: false, msg: "User is not authorized" });

        next();

    } catch (err) {
        res.status(500).send({ status: false, error: err.message });
    }
};

module.exports = { authentication, authorization };
