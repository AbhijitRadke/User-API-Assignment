const { Router } = require('express')
const router = Router()
const userController = require("../Controllers/userControllers")
const middlewares = require("../Middleware/auth")


/**
 * @swagger
 * /route:
 *   get:
 *     summary: Returns the list of all the books
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the Users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/Models/userModel'
 */

router.post("/users", userController.userCreate)

router.post("/login", userController.userLogin)

router.get("/users", userController.allUsers)

router.get("/users/:Id", middlewares.authentication, middlewares.authorization, userController.userById)

router.put("/users/:Id", middlewares.authentication, middlewares.authorization, userController.updateUser)

router.delete("/users/:Id", middlewares.authentication, middlewares.authorization, userController.deleteUserById)


// router.all("/**", (req, res) => {
//     return res.status(400).send({ status: false, message: "your URL is wrong plese check endpoint" })
// })









module.exports = router