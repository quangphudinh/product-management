// [GET] /
module.exports.index = async (req, res) => {
    res.render('client/pages/chat/index.pug', {
        titlePage: 'Chat'
    })
}