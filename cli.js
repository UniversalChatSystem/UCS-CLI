#!/usr/bin/env node
const WebSocket = require('ws');

var timestamp = require('time-stamp');

const chalk = require('chalk');

var port = 3001; //The same port that the server is listening on
var host = '138.197.114.14'/*'138.197.114.14'*/;
var socket = new WebSocket('ws://'+host+":"+port, {
  origin: 'http://'+host
});
socket.sendJson = function(data){
  this.send(JSON.stringify(data));
}
var username = "none";
var hasUsername = false;
socket.on('open', function() { //Don't send until we're connected

    log("Connected to host (" + host + ":" + port + ")");
    log("Please enter a username:");
    rl.prompt();

});

socket.on('message', function(message){
    var data = JSON.parse(message);
    if(data.command == "broadcast")
    {
        if(data.data.sender != username) {
            log(data.data.sender + ": " + data.data.message);
            rl.prompt();
        }
    }
});

const readline = require('readline');

var rl = readline.createInterface({

  input: process.stdin,
  output: process.stdout,
  prompt: '> '

});

rl.on('line', (line) => {
    if(hasUsername == true)
    {
        socket.sendJson({command: "sendMessage", data: {sender: username, message: line}});

        rl.prompt();
    } else {
        socket.sendJson({command: "username", data: {sender: line}});
        hasUsername = true;
        username = line;
        rl.setPrompt("["+line+"]: ");
        rl.prompt();
    }

}).on('close', () => {

  console.log('Have a great day!');
  process.exit(0);

});

var log = function(message)
{
  var TimeStamp = timestamp('[HH:mm:ss]');
  var format = chalk.cyan(TimeStamp + chalk.white(message));
  console.log(format);
};
