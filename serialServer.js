const http = require("http");
const express = require("express");
const app = express();
const io = require('socket.io');
const { SerialPort } = require('serialport');
const { time } = require("console");
const { Socket } = require("dgram");
let Sweight =''
let Mweight =''
let Lweight =''
let Sstate  =true
let Mstate  =true
let Lstate  =true
let size = 1


const httpServer = http.createServer(app).listen(3001);
// 3001번 포트에서 서버를 오픈한다.
const socketServer = io(httpServer, {
    cors: {
    origin: "*",
    methods: ["GET", "POST"]
    }
});


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

// Serial port에 새로운 Data가 전송되어 data buffer 가 Update 되면 실행되는 Callback function
Sscale.on('data', function (data) {
	Sweight=data.toString('utf8').substr(5,8);
  });

Mscale.on('data', function (data) {
	Mweight=data.toString('utf8').substr(5,8);
});

LScale.on('data', function (data) {
	Lweight=data.toString('utf8').substr(5,8);
});



  







  
socketServer.on('connection', (socket) => {
	

	setInterval(()=>{
		if(size==1){
			socketServer.emit("rs/Weight",Sweight)
		}else if(size==2){
			socketServer.emit("rs/Weight",Mweight)
		}else if(size==3){
			socketServer.emit("rs/Weight",Lweight)
		}
		},300)
		console.log("연결",socket.id)    // 여기서부터 필요한 내용을 작성하면 

	

    socket.on('disconnect', function() {
 	   console.log("SOCKETIO disconnect EVENT: ", socket.id, " client disconnect");
	//    socketServer.local.disconnectSockets()
		socketServer.disconnectSockets()
		socketServer.local.disconnectSockets()
		socket.disconnect()
    // 여기서부터 필요한 내용을 작성하면 된
    })

    socket.on('ch/scale', (size) => {
        size = req
        console.log("Size : "+size)
    });



});