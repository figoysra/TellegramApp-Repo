const express = require("express")
const bodyparser = require("body-parser")
const cors = require("cors")
const userRouter = require ("./src/router/users")
const http = require("http");
const { Server } = require("socket.io");
const socketModel = require("./src/model/socket")

const app = express()
app.use(cors())
app.use(bodyparser.json())
app.use(express.static(__dirname+ "/uploads"))
app.use(userRouter)

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
    socket.on("send-message", (payload)=>{
        // const { sender, receiver, message} = payload
        socketModel
            .insertMessage(payload)
            .then((response)=>{
                io.to(payload.reciever).emit("list-message", payload)
            })
    })
    socket.on("get-message", ({sender, receiver})=>{
        socketModel
            .getMessage({sender, receiver})
            .then((response)=>{
                io.to(sender).emit("history-messages", response)
            })
    })
})


const PORT = 2000;
httpServer.listen(PORT, () => {
    console.log(`Service running on Port ${PORT}`);
});

module.exports = app