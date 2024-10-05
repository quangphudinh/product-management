const Chat = require('../../models/chat.model')
const User = require('../../models/user.model')
// [GET] /
module.exports.index = async (req, res) => {
    const userId = res.locals.user.id
    const fullName = res.locals.user.fullName
    //socket
    _io.once('connection', (socket) => {
        socket.on('CLIENT_SEND_MESSAGE', async(content) => {
            //luw vao db
            const chat = new Chat({
                user_id: userId,
                content: content
            });
            await chat.save();
            
            // trả về client (realtime)
            _io.emit('SERVER_RETURN_MESSAGE', {
                userId : userId,
                fullName : fullName,
                content : content
            });
        })

        //Typeing
        socket.on('CLIENT_SEND_TYPING', async (type) => {
            socket.broadcast.emit('SERVER_RETURN_TYPING', {
                userId : userId,
                fullName : fullName,
                type : type
            })
        })
    });
    //End socket
    const chats = await Chat.find({
        deleted: false
    });
    
    for(const chat of chats){
        const inforUser = await User.findOne({
            _id: chat.user_id
        }).select('fullName')
        chat.inforUser = inforUser
    }
    //lay data tu DB

    res.render('client/pages/chat/index.pug', {
        titlePage: 'Chat',
        chats : chats
    })
}