import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

//CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
    formSendData.addEventListener('submit', (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value;
        if (content) {
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

    if (myID == data.userId) {
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
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
}
//End Scoll chat to Bottom

//Show icon emoji chat
    // show popup
        const buttonIcon = document.querySelector(".btn-icon");
        if(buttonIcon){
            const tooltip = document.querySelector(".tooltip");
            Popper.createPopper(buttonIcon, tooltip);
            
            buttonIcon.onclick = () => {
                tooltip.classList.toggle('shown')
            }
        }
    // end show popup
    //Insert icon to input
        const emojiPicker = document.querySelector("emoji-picker");
        if(emojiPicker){
            const inputChat = document.querySelector(".chat .inner-form input[name='content']");
            emojiPicker.addEventListener('emoji-click', (event) => {
                const icon = event.detail.unicode;
                inputChat.value += icon;
              
            });
          
        }
    //End Insert icon to input
//End Show icon emoji chat