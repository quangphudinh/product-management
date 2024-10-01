var socket = io();

// socket.on('SEVER_SEND_SOCKET_ID', (data) => {
//     const elementSocketID = document.querySelector('#socket-id');
//     elementSocketID.innerHTML = data;
//     console.log('message: ' + data);
// });



// var form = document.getElementById('form');
// var input = document.getElementById('input');

// form.addEventListener('submit', function (e) {
//     e.preventDefault();
//     if (input.value) {
//         socket.emit('CLIENT_SEND_MESSAGE', input.value);
//         input.value = '';
//     }
// });

// socket.on('SEVER_RETURN_MESSAGE', (data) => {
//     console.log('message: ' + data);
// });