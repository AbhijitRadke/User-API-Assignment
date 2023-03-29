const { Router } = require('express')
const router = Router()
const userController = require("../Controllers/userControllers")
const middlewares = require("../Middleware/auth")

router.post("/users", userController.userCreate)

router.post("/login", userController.userLogin)

router.get("/users", userController.allUsers)

router.get("/users/:Id", middlewares.authentication, middlewares.authorization, userController.userById)

router.put("/users/:Id", middlewares.authentication, middlewares.authorization, userController.updateUser)

router.delete("/users/:Id", middlewares.authentication, middlewares.authorization, userController.deleteUserById)


module.exports = router