// const express = require('express');

let chatperson= document.getElementById('chatperson')
let sendChats= document.getElementById('sendChat')
let textBox= document.getElementById('chatmsg')
const messageBox = document.querySelector("#messages");

function createMessage(text,ownMessage=false) {
    const messageElement = document.createElement("div");
    messageElement.className = "chat-message";
    const subMesssageElement = document.createElement("div");
    subMesssageElement.className =
      "px-4 py-4 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600";
    if (ownMessage) {
      subMesssageElement.className += " float-right bg-blue-800 text-white";
    }
    subMesssageElement.innerText = text;
    messageElement.appendChild(subMesssageElement);
  
    messageBox.appendChild(messageElement);
}
const socket = io();
socket.on("connection", (socket) => {
  console.log(socket.id);
});
function sortStringAscending(str) {
    // Convert the string to an array of characters
    let charArray = str.split('');

    // Sort the array in ascending order
    charArray.sort();

    // Join the sorted array back into a string
    let sortedStr = charArray.join('');

    return sortedStr;
}

async function chatwith(to,from){
    console.log('dfg');
    console.log(to);
    console.log(from);
    messageBox.innerHTML=''
    let response = await fetch(`/user/api/user/${to}`);
    let user = await response.json();
    let roomid = `${from}_${to}`
    let roomidAsc = sortStringAscending(roomid);
    console.log('user',user);
    chatperson.innerText=`CHAT With ${user[0].firstname}`

    sendChats.setAttribute('onclick',`sendChat("${roomidAsc}")`)
    socket.emit("chatto", roomidAsc);
}



socket.on("receive-message", (message) => {
  console.log("receive-message",message);
  
  createMessage(message);
});
function sendChat(roomid) {
  console.log(textBox);
  
  if (textBox.value != "") {
      console.log('roomid',roomid);
      socket.emit("send-message", textBox.value);
      createMessage(textBox.value, true);
      textBox.value = "";
  }
}
