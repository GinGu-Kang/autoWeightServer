const http = require("http");
const express = require("express");
const app = express();
const io = require('socket.io');
const request = require("request")


const httpServer = http.createServer(app).listen(3001);
// 3001번 포트에서 서버를 오픈한다.
let reqURL = ""
let eProreqNum =""

const socketServer = io(httpServer, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});

socketServer.on('connect', (socket) => {

    console.log("SOCKETIO connect EVENT: ", socket.id, " client connect");

    socket.on('disconnect', function() {
        console.log("SOCKETIO disconnect EVENT: ", socket.id, " client disconnect");
        socketServer.disconnectSockets()
        socketServer.local.disconnectSockets()
        // 여기서부터 필요한 내용을 작성하면 된
   })
   socket.on('isOn', (req) => {
    console.log(true);
    socketServer.emit("rs/Weight",req)
    // console.log(socketServer.sockets)
});
    socket.on('isConnect', (req) => {

        socketServer.emit("isConnect",true)
    });


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

    socket.on('plan', (req) => {
        reqURL = "http://119.203.229.31:8080/CCB/MES/eProductionPlanList.do"
        request({url:reqURL,method:'POST'},function(err,res,body){
            socket.emit('plan',res)
        })
	});

    //변수 확인
    //포스트 확인
    socket.on('work', (eProreqNum) => {
        reqURL = `http://119.203.229.31:8080/CCB/MES/eProductionPlanSelect.do?eProreqNum=${eProreqNum}`
        console.log(eProreqNum)
        request({url:reqURL,method:'POST'},function(err,res,body){
            try {
                socket.emit('work',res.body)    
            } catch (error) {
                socket.emit('work',"error")
            }
            
        })
	});

    socket.on('isPrjComplete', (res) => {

        reqURL = `http://119.203.229.31:8080/CCB/MES/eSetMaterialInfo.do?${res}`
        console.log(reqURL)
        request({url:reqURL,method:'POST'},function(err,res,body){
            console.log(reqURL)
            try {
                // socket.emit('isPrjComplete',true)    
                // console.log(res)
                console.log(res.body)
                console.log("성공")
            } catch (err) {
                // socket.emit('isPrjComplete',false)
                console.log(err)
            }     
        })
	});

    
});