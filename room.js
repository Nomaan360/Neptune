
const ROOM_MAX_CAPACITY = 2;
let roomsState = [];


  const joinRoom=(roomid)=> {
    return new Promise((resolve) => {
      console.log('le', roomsState.length);
      console.log('roomsState', roomsState);
      
        for (let i = 0; i < roomsState.length; i++) {
          console.log('i',i);
          console.log('roomsState[i].users',roomsState[i].users);
          if (roomsState[i].id == roomid) {
            console.log('push');
            
            roomsState[i].users++;
            return resolve(roomsState[i].id);
          }
        }
  
      roomsState.push({
        id: roomid,
        users: 1,
      });
      return resolve(roomid);
    });
  }

  const leaveRoom=(id)=> {
    roomsState = roomsState.filter((room) => {
        if (room.id === id) {
          if (room.users === 1) {
            return false;
          } else {
            room.users--;
          }
        }
        return true;
    });
  }


  module.exports = {
    joinRoom,leaveRoom
  };