const http = require("http");
const express = require("express");
const app = express();
const io = require('socket.io');
const { SerialPort } = require('serialport');



const httpServer = http.createServer(app).listen(3001);
// 3001번 포트에서 서버를 오픈한다.

const socketServer = io(httpServer, {
    cors: {
    origin: "*",
    methods: ["GET", "POST"]
    }
});


socketServer.on('connect', (socket) => {

    console.log("연결",socket.id)

    socket.on('disconnect', function() {
    console.log("SOCKETIO disconnect EVENT: ", socket.id, " client disconnect");
    // 여기서부터 필요한 내용을 작성하면 된
    })


    socket.on('weight', (req) => {
        console.log(req);
        socketServer.emit("rs/Weight",req)
        // console.log(socketServer.sockets)
    });
    socket.on('setRow', (req) => {
        console.log(req);
        console.log('@@@@@@@@@@@@@@@@@@@l');
        socketServer.emit("setRow",req)
        // console.log(socketServer.sockets)
    });

    socket.on('ch/weight', (req) => {
        weight = req
        console.log("무게 : "+weight)
        socketServer.emit("rs/Weight",req)
    });



});
