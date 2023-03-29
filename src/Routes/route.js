const { Router } = require('express')
const router = Router()
const userController = require("../Controllers/userControllers")

router.post("/users", userController.userCreate)

router.post("/login", userController.userLogin)

router.get("/users", userController.allUsers)

router.get("/users/:Id", userController.userById)

router.put("/users/:Id", userController.updateUser)

router.delete("/users/:Id", userController.deleteUserById)


module.exports = router