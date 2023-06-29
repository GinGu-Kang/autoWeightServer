const http = require("http");
const express = require("express");
const app = express();
const io = require('socket.io');
const request = require("request")
const { SerialPort } = require('serialport');
const httpServer = http.createServer(app).listen(3001);
let Sweight =1
let Mweight =2
let Lweight =3
let Sstate  =true
let Mstate  =true
let Lstate  =true
let size = 1

//계속 돌고 있다가 트래킹하는 저울 숫자만 변경
//해당 저울로 변경했는데 오류 시 다른 저울변경 
const Sscale = new SerialPort({
    path: 'COM5',
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
    },(err)=>{
    
        Sstate=false
    });
    
    const Mscale = new SerialPort({
        path: 'COM6',
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        },(err)=>{
            Mstate = false
        });
    
    const LScale = new SerialPort({
        path: 'COM7',
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        },(err)=>{
            Lstate=false
        });

        Sscale.on('data', function (data) {
            Sweight=data.toString('utf8').substr(5,8);
          });
        
        Mscale.on('data', function (data) {
            Mweight=data.toString('utf8').substr(5,8);
        });
        
        LScale.on('data', function (data) {
            Lweight=data.toString('utf8').substr(5,8);
        });




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

    //초마다 무게값 전달
    console.log("Size : "+size)
    // setInterval(()=>{
	// 	if(size==1){
	// 		socketServer.emit("rs/Weight",Sweight)
	// 	}else if(size==2){
	// 		socketServer.emit("rs/Weight",Mweight)
	// 	}else if(size==3){
	// 		socketServer.emit("rs/Weight",Lweight)
	// 	}
	// 	},300)

    socket.on('ch/scale', (req) => {
        size = req
        console.log("Size : "+size)
    });



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
            try {
                // console.log(encodeURIComponent(reqURL))
                socket.emit('isPrjComplete',true)    
                // console.log(res)
                console.log(res.body)
                console.log("성공")
            } catch (err) {
                socket.emit('isPrjComplete',"실패")
                console.log(err)
            }     
        })
	});

    
});