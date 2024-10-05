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
            socket.emit('CLIENT_SEND_TYPING', "hidden");
        }
    })
}
//END_CLIENT_SEND_MESSAGE

//SERVER_RETURN_MESSAGE
socket.on('SERVER_RETURN_MESSAGE', (data) => {
    const body = document.querySelector('.chat .inner-body');
    const myID = document.querySelector("[my-id]").getAttribute("my-id");
    const boxTyping = document.querySelector(".chat .inner-list-typing");

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
    body.insertBefore(div, boxTyping);

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
if (buttonIcon) {
    const tooltip = document.querySelector(".tooltip");
    Popper.createPopper(buttonIcon, tooltip);

    buttonIcon.onclick = () => {
        tooltip.classList.toggle('shown')
    }
}
// end show popup

// Show typing
var timeOut;
const showTyping = () => {
    socket.emit('CLIENT_SEND_TYPING', "show");
        
        clearTimeout(timeOut);

        timeOut = setTimeout(() => {
            socket.emit('CLIENT_SEND_TYPING', "hidden");
        },3000);
}
// end Show typing

//Insert icon to input
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
    const inputChat = document.querySelector(".chat .inner-form input[name='content']");
    emojiPicker.addEventListener('emoji-click', (event) => {
        const icon = event.detail.unicode;
        inputChat.value += icon;

        //focus vao input chat sau khi chọn icon
        const end  = inputChat.value.length;
        inputChat.setSelectionRange(end, end);
        inputChat.focus();

        showTyping();
    });

    //Typing input KEYUP
    
    inputChat.addEventListener('keyup', () => {
        showTyping();
    })
    //End Typing

}
//End Insert icon to input
//End Show icon emoji chat

//SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");
if (elementListTyping) {
    socket.on('SERVER_RETURN_TYPING', (data) => {
        console.log(data);
        if (data.type == "show") {
            const body = document.querySelector('.chat .inner-body');
            const existTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
            if (!existTyping) {
                const boxTyping = document.createElement('div');
                boxTyping.classList.add('box-typing');
                boxTyping.setAttribute("user-id", data.userId);

                boxTyping.innerHTML = `
                    <div class="innr-name">${data.fullName}</div>
                    <div class="inner-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
            `;
                elementListTyping.appendChild(boxTyping);
                body.scrollTop = bodyChat.scrollHeight;
            }
        }else {
            const boxTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
            if (boxTyping) {
                elementListTyping.removeChild(boxTyping);
            }
        }
    })
}
//END_SERVER_TYPING
 //28-8 -29