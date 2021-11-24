const express = require("express")
const bodyparser = require("body-parser")
const cors = require("cors")
const userRouter = require ("./src/router/users")
const contactsRouter = require("./src/router/contacts")
const http = require("http");
const { Server } = require("socket.io");
const socketModel = require("./src/model/socket");
const {PORT}= require("./src/helpers/env")

const app = express()
app.use(cors())
app.use(bodyparser.json())
app.use(express.static(__dirname+ "/uploads"))
app.use(userRouter)
app.use(contactsRouter);

const httpServer = http.createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
})
io.on("connection", (socket)=>{
    console.log("Client Connected")
    socket.on("login", (room)=>{
        console.log("a user joined room" + room)
        socket.join(room)
        
    })
    socket.on("broadcast", (id)=>{
        socket.broadcast.emit("get-online-broadcast", id);
    })
    socket.on("send-message", (data)=>{
        // const { sender, receiver, message} = payload
        // console.log(data.receiver)
        socketModel
            .insertMessage(data)
            .then((response)=>{
                // console.log(response.insertId)
                const payload = { ...data, id: response.insertId }
                // console.log(payload)
                io.to(data.receiver).emit("list-message", payload)
            })
    })
    socket.on("get-message", ({sender, receiver})=>{
        socketModel
            .getMessage({sender, receiver})
            .then((response)=>{
                io.to(sender).emit("history-messages", response)
            })
    })

    socket.on("get-delete-Message", (id, user)=>{
        socketModel
            .destroyMessage(id)
            .then((response)=>{
                io.to(user).emit("deleteMessage", response)
            })
    })
})


httpServer.listen(PORT, () => {
    console.log(`Service running on Port ${PORT}`);
});

module.exports = app