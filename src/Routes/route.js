const { Router } = require('express')
const router = Router()
const userController = require("../Controllers/userControllers")

router.post("/users", userController.userCreate)


module.exports = router