const express = require("express")
const http = require("http")
const app = express();
const path = require("path")
const server = http.createServer(app)
const socketIO = require("socket.io")
const io = socketIO(server);




app.use(express.static(path.join(__dirname,"src")));
const PORT =process.env.PORT ||3000


console.log("왜이량")


io.on("connetction",(socket)=>{
    console.log('연결대체 왜안대')
    socket.on("hi",(e)=>{
        console.log(e)
    })
})



server.listen(PORT,()=>console.log(`server is running ${PORT}`))