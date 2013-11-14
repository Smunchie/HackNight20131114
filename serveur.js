var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , util = require('util')
  , twitter = require('twitter');

//Initialisation
var twit = new twitter({
    consumer_key: 'gObsEtSGMuOtpnboCBSF8A',
    consumer_secret: 'QFIK21PRicxqd9wpwPSwvbXmHHuxSKgLzIFK9yQ',
    access_token_key: '16724205-IJdlir58LsuVQxFkK1zZcM5KxVPhtg2HdWA3C6cuD',
    access_token_secret: 'Nhdw5qK1TyL1XOSko7ZSm7Gf70LoE3kdL6NmkHTe2qapX'
});

app.listen(80);

function handler(req, res) {
    fs.readFile(__dirname + '/index.html',
    function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }

        res.writeHead(200);
        res.end(data);
    });
}

io.sockets.on('connection', function (socket) {
    //Récupération des tweets avec le mot-clé "Dexter"
    twit.stream('filter', { track: 'Dexter' }, function (stream) {
        //Lorsqu'un nouveau tweet est reçu....
        stream.on('data', function (data) {
            //On va récupérer sa version "embedded" grâce à son id
            twit.get('/statuses/oembed.json', { id: data.id_str, omit_script: true }, function (tweet) {
                //Envoi au client
                socket.emit('tweet', tweet);
            });
        });
    });
});