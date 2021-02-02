var express = require('express'),
    app = express(),
    http = require("http").Server(app),
    io = require('socket.io')(http),
    path = require('path'),
    bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var data = {
    slides: [
        {
            main: { 
                content: "Test main",
                type: "text"
            },
            additionnal: [
                {
                    content: "Test additionnal",
                    type: "text"
                },
                {
                    content: "imgtest.jpg",
                    type: "image"
                }
            ]
        },
        {
            main: {
                content: "audiotest.mp3",
                type: "audio"
            }
        },
        {
            main: { 
                content: "Test main 3",
                type: "text"
            },
            additionnal: [
                {
                    content: "Test additionnal 3",
                    type: "text"
                },
                {
                    content: "videotest.mp4",
                    type: "video"
                },
            ]
        }
    ]
}


app.get('/', (req, res) => {
    res.render('index', {data});
})


io.on('connection', (socket) => {
    console.log("Connected");
    socket.on('slideChange', (label) => {
        var address = socket.conn.remoteAddress;
        var host = socket.handshake.headers.host.split(':').shift();
        var id = +(label.label.split(" / ").shift()) - 1;
        if(address == host) {
            io.emit("change", id);
        }
    });
});

http.listen('8080', '0.0.0.0', () => {
    console.log('Srv up on ::8080');
});