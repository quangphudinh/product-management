require('dotenv').config();
const express = require('express')
const methodOverride = require('method-override')
const path = require('path')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('express-flash');
const moment = require('moment');
//socketio
const http = require('http');
const { Server } = require("socket.io");



const database = require('./config/database');

const systemConfig = require('./config/system');

const routes = require('./routes/client/index.route');
const routesAdmin = require('./routes/admin/index.route');

database.connect();


const app = express()
const port = process.env.PORT //lay PORT = 3000

//SocketIO
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
});
//end-socketio
//End SocketIO

app.use(methodOverride('_method'));

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//publish file
app.use(express.static(`${__dirname}/public`));

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

// ex flash
app.use(cookieParser('keyboard random'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

//TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// Variables Globales
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment; // thư viện chuyển đổi date thành chuỗi or chuỗi thành date

//Routes
routes(app);
routesAdmin(app);
app.get("*", (req, res) => {
  res.render("client/pages/errors/404.pug" ,{
      pageTitle : "404 Not Found"
    }
  )
})

// app.listen(port , () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// });
server.listen(port , () => {
  console.log(`Example app listening at http://localhost:${port}`)
});