// [GET] /
module.exports.index = async (req, res) => {
    //socket
    _io.on('connection', (socket) => {
        console.log('a user connected', socket.id);
      });

    res.render('client/pages/chat/index.pug', {
        titlePage: 'Chat'
    })
}