//CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if(formSendData){
    formSendData.addEventListener('submit', (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value;
        if(content){
            socket.emit('CLIENT_SEND_MESSAGE', content);
            e.target.elements.content.value = '';
        }
    })
}
//END_CLIENT_SEND_MESSAGE

//SERVER_SEND_MESSAGE
socket.on('SERVER_RETURN_MESSAGE', (data) => {
    const body = document.querySelector('.chat .inner-body');
    const myID = document.querySelector("[my-id]").getAttribute("my-id");
    
    const div = document.createElement('div');
    let htmlFullName = '';

    if(myID == data.userId){
        div.classList.add('inner-outgoing');
    } else {
        div.classList.add('inner-incoming');
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`
    }
   
    div.innerHTML = `
        ${htmlFullName}
        <div class="inner-content">${data.content}</div>
    `;
    body.appendChild(div);
    body.scrollTop = bodyChat.scrollHeight;
})
//END_SERVER_RETURN_MESSAGE

//Scroll chat to Bottom : scoll tin nhắn xuống dưới cùng để hiển thị tin nhắn mới nhất
const bodyChat = document.querySelector('.chat .inner-body');
if(bodyChat){
    bodyChat.scrollTop = bodyChat.scrollHeight;
}
//End Scoll chat to Bottom

