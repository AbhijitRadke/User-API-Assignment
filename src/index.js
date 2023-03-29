const express = require('express')
const app = express()
const mongoose = require('mongoose')
const route = require('./routes/route')

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");


const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Users API Assignment",
            version: "1.0.0",
            description: "A simple API to perform CRUD oprations on user",
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ["./route/*.js"],
};

const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));











app.use(express.json())
mongoose.set('strictQuery', true)

mongoose.connect('mongodb+srv://prakashurkude:prakash1998@cluster0.nuhssqs.mongodb.net/User-Assignment', { useNewUrlParser: true })
    .then(() => console.log("MongoDB is connected"))
    .catch((err) => console.log(err.message))

app.use('/', route)

app.listen(3000, function () {
    console.log("Express app is running on port 3000")
})




