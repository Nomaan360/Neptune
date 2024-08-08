const ROOM_MAX_CAPACITY = 10; // Define your maximum room capacity
let roomsState = []; // Array to hold room information

// Function to join a room
const joinRoom = (roomid) => {
  return new Promise((resolve, reject) => {
    let room = roomsState.find(r => r.id === roomid);

    if (room) {
      if (room.users < ROOM_MAX_CAPACITY) {
        room.users++;
        resolve(roomid);
      } else {
        reject(new Error('Room is full'));
      }
    } else {
      // Create a new room if it does not exist
      roomsState.push({
        id: roomid,
        users: 1,
        messages: [] // Initialize with an empty message list
      });
      resolve(roomid);
    }
  });
};

// Function to add a message to a room
const addMessageToRoom = (roomid, userId, message) => {
  return new Promise((resolve, reject) => {
    let room = roomsState.find(r => r.id === roomid);

    if (room) {
      room.messages.push({ userId, message, timestamp: new Date() });
      console.log(`Message added to room ${roomid}`);
      resolve();
    } else {
      reject(new Error('Room not found'));
    }
  });
};

// Function to get messages from a room
const getMessagesFromRoom = (roomid) => {
  return new Promise((resolve, reject) => {
    let room = roomsState.find(r => r.id === roomid);

    if (room) {
      resolve(room.messages);
    } else {
      reject(new Error('Room not found'));
    }
  });
};
module.exports = {
  joinRoom,addMessageToRoom,getMessagesFromRoom,roomsState
};
// Example Usage
const userId = 'user1'; // Assume a user ID is provided

// Join a room
// joinRoom('room1', userId)
//   .then(roomid => {
//     // Add a message to the room
//     return addMessageToRoom(roomid, userId, 'Hello, world!');
//   })
//   .then(() => {
//     // Get messages from the room
//     return getMessagesFromRoom('room1');
//   })
//   .then(messages => {
//     console.log('Messages in room1:', messages);
//   })
//   .catch(err => {
//     console.error('Error:', err.message);
//   });
