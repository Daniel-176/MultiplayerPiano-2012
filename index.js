const express = require('express');
const app = express();
const http = require('http');
const { EventEmitter } = require('node:events');
const send = require('send');
const md5 = require('md5');
const events = new EventEmitter();
const server = http.createServer(app);
const wss = require("ws")
const fs = require("fs")
const ws = new wss.WebSocketServer({
    server:server
})
var userdata = JSON.parse(fs.readFileSync('userdata.json'))
saveuserdata = () => {
    fs.writeFileSync('userdata.json', JSON.stringify(userdata))
}
app.use(express.static('public'));

ws.addListener("connection", (wss, req) => {
    var clientId = md5(req.headers['x-forwarded-for'] || req.connection.remoteAddress)
    function sendArray(arr) { 
        wss.send(JSON.stringify(arr))
    }

    sendArray([{m:'n', msg:"hellodumb", t:"Multiplayer Pain", ms:100, h:false, }])
    wss.addEventListener("message", (event) => {
        try {
            console.log(event.data)
            var json = JSON.parse(event.data)
            json.forEach(msg => {
                if(!msg.m) return;
                if(msg.m == "hi") {
                    sendArray([{m:'hi', youreconnected:':)'}])
                    sendArray([{m:'u', i:clientId, t:new Date().getTime(), r:{ settings:{chat:true,name:'lobby'}}}])
                }
                if(msg.m == "n") {
                    var msg = [{
                        m:"n",
                        note:msg.note,
                        time:msg.time,
                        participantId:clientId
                    }]
                    ws.clients.forEach(c => {
                        c.send(JSON.stringify(msg))
                    })
                }
                if(msg.m == "a") {
                    var msg = [{
                        m:"a",
                        message: msg.message,
                        p: {
                            id: clientId,
                            name: (userdata[clientId] || 'Anonymous')
                        }
                    }]
                    ws.clients.forEach(c => {
                        c.send(JSON.stringify(msg))
                    })
                }
                if(msg.m == "setname") {
                    userdata[clientId] = msg.name || "Anonymous"
                    var msg = [{
                        m:"m",
                        id: clientId,
                        name: msg.name
                    }]
                    saveuserdata()
                    ws.clients.forEach(c => {
                        c.send(JSON.stringify(msg))
                    })
                }
                if(msg.m == "m") {
                    var msg = [{
                        m:"m",
                        x: msg.x,
                        y: msg.y,
                        id:clientId
                    }]
                    ws.clients.forEach(c => {
                        c.send(JSON.stringify(msg))
                    })
                }
            });
        } catch(e) {console.log(e)}
    })
})
function sendArray(arr) {
    ws.clients.forEach(c => {
        c.send(JSON.stringify(arr))
    })
} 



server.listen(3000, () => {
  console.log('listening on *:3000');
});