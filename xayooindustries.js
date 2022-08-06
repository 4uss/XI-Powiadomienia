const axios = require('axios');
const globalConfig = require('./config/config.js');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const yt = require('@3xanax/youtube-stream-status');

var port = process.env.PORT || 3000
var users = [];
/*--------------------------------------------------------------------------------------------
                                            STATUS
---------------------------------------------------------------------------------------------*/
var xayoo = 0;
var suchar = 0;
var japczan = 0;
var popo = 0;
var lukisteve = 0;
var holak = 0;
var aki = 0;
var vysotzky = 0;
var dejvid = 0;
var mlodziutki7 = 0;
var dejvid_tibijski_zadymiarz = 0;

app.get('/', function (req, res) {
    res.send(`<!DOCTYPE html><html lang="en"> <head> <meta charset="utf-8" /> <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" /> <title>BeyondLabs</title> <meta property="og:type" content="website" /> <link rel="icon" type="image/png" sizes="560x560" href="https://cdn.beyondlabs.pl/assets/img/logo512.png" /> <style> @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;400&display=swap'); body{ margin: 0; padding: 0; font-family: 'Roboto', sans-serif; } .bl__box{ height: 100%; width: 100%; position: absolute; text-align: left; display: grid; place-content: center; } h1{ font-weight: 100; color: black !important; } a{ font-weight: 100; color: #565ac6; text-decoration: none; } </style> </head> <body class="bl__box"> <div> <h1>Xayoo Industries Alerts</h1> <h2>Created by <a href="https://beyondlabs.pl/">BeyondLabs.pl</a> <br/>docs - <a href="https://docs.beyondLabs.pl/">docs.beyondLabs.pl</a></h1> </div> </body></html>`)
})

function onlineStreams(){
    return `{"follows":[
        {
            "STATUS": ${xayoo}, 
            "CHANNEL_ID": "xayoo", 
            "TWITCH" : "xayoo_"
        }, 
        {
            "STATUS": ${suchar}, 
            "CHANNEL_ID": "suchar", 
            "TWITCH" : "mokrysuchar"
        }, 
        {
            "STATUS": ${japczan}, 
            "CHANNEL_ID": "japczan", 
            "TWITCH" : "japczan"
        }, 
        {
            "STATUS": ${popo}, 
            "CHANNEL_ID": "popo", 
            "TWITCH" : "popo"
        }, 
        {
            "STATUS": ${lukisteve}, 
            "CHANNEL_ID": "lukisteve", 
            "TWITCH" : "lukisteve"
        }, 
        {
            "STATUS": ${holak}, 
            "CHANNEL_ID": "holak", 
            "TWITCH" : "holak1337"
        }, 
        {
            "STATUS": ${aki}, 
            "CHANNEL_ID": "aki", 
            "TWITCH" : "aki_997"
        }, 
        {
            "STATUS": ${vysotzky}, 
            "CHANNEL_ID": "vysotzky", 
            "TWITCH" : "vysotzky"
        }, 
        {
            "STATUS": ${dejvid}, 
            "CHANNEL_ID": "dejvid", 
            "TWITCH" : "dejvid",
            "PLATFORM": "YouTube"
        }, 
        {
            "STATUS": ${mlodziutki7}, 
            "CHANNEL_ID": "mlodziutki7", 
            "TWITCH" : "mlodziutki7"
        },
        {
            "STATUS": ${dejvid_tibijski_zadymiarz}, 
            "CHANNEL_ID": "dejvid_tibijski_zadymiarz", 
            "TWITCH" : "dejvid_tibijski_zadymiarz"
        }]}`;
}
/*--------------------------------------------------------------------------------------------
                                        ZAPYTANIE TTV
---------------------------------------------------------------------------------------------*/
function check(){
    zapytaj(globalConfig.xayoo, 'xayoo')
    zapytaj(globalConfig.suchar, 'suchar')
    zapytaj(globalConfig.japczan, 'japczan')
    zapytaj(globalConfig.popo, 'popo')
    zapytajYouTube(globalConfig.dejvid, 'dejvid', 'https://cdn.beyondlabs.pl/XI/XI-dejvid_live.png', 'www.youtube.com/c/dejvidtibijskizadymiarz', 'dejvid tibijski zadymiarz')
    zapytaj(globalConfig.lukisteve, 'lukisteve')
    zapytaj(globalConfig.holak, 'holak')
    zapytaj(globalConfig.aki, 'aki')
    zapytaj(globalConfig.vysotzky, 'vysotzky')
    zapytaj(globalConfig.mlodziutki7, 'mlodziutki7')
    zapytaj(globalConfig.dejvid_tibijski_zadymiarz, 'dejvid_tibijski_zadymiarz')
}
/*--------------------------------------------------------------------------------------------
                                        DANE OD TTV
---------------------------------------------------------------------------------------------*/
function zapytaj(id, nick){

    //https://id.twitch.tv/oauth2/token?client_id=lx8gmael3hdeg3ttv3avzxrvxwuj3e&client_secret=7pwphyuazyc1venesxfbtgc23nn6rh&grant_type=client_credentials
    //"expires_in": 5698531

    const options = {
        headers: {
            'Client-ID': 'lx8gmael3hdeg3ttv3avzxrvxwuj3e',
            'Authorization': 'Bearer 17uyhahvbxzpr9s2i31zg5glzb2qj1',
            'Accept': 'application/vnd.twitchtv.v5+json'
        }
    };

    axios.get(`https://api.twitch.tv/helix/streams?user_id=${id}`, options).then(
        (response) => {
            var apiResponse = response.data.data[0];

            if(apiResponse === undefined || !apiResponse){
                zapytajLive(nick, 'false');
            }else{
                zapytajLive(nick, 'true', `https://static-cdn.jtvnw.net/previews-ttv/live_user_${apiResponse.user_login}-1920x1080.jpg`, apiResponse.title, apiResponse.user_name);
            }
        },
        (error) => {
            console.log(error);
        }
    );
}
/*--------------------------------------------------------------------------------------------
                                        DANE OD TTV
---------------------------------------------------------------------------------------------*/
function zapytajYouTube(id, nick, thumbnail, title, displayname){

    yt.getStream(id)
    .then(data => {
        if(!data.stream || data.stream === null){
            zapytajLive(nick, 'false');
        }else{
            zapytajLive(nick, 'true', thumbnail, title, displayname);
        }
    })
}
/*--------------------------------------------------------------------------------------------
                                    Ustawienie STATUSU
---------------------------------------------------------------------------------------------*/
function zapytajLive(nick, status, thumbnail, title, displayname){
    /*-----------
        XAYOO
    -------------*/
        if(nick === 'xayoo'){
            console.log(status)
            if(status == "false"){
                if(xayoo !== 0){
                    xayoo = 0;
                    console.log('Xayoo set 0')
                }
            }else if(status == "true"){
                if(xayoo !== 1){
                    xayoo = 1;
                    console.log('Xayoo set 1')
                    streamLive(displayname, thumbnail, title, nick);
                }
            }
        }
    /*-----------
        SUCHAR
    -------------*/
        else if(nick === 'suchar'){
            if(status == "false"){
                if(suchar !== 0){
                    suchar = 0;
                }
            }else if(status == "true"){
                if(suchar !== 1){
                    suchar = 1;
                    streamLive(displayname, thumbnail, title, nick);
                }
            }
        }
    /*-----------
        JAPCZAN
    -------------*/
        else if(nick === 'japczan'){
            if(status == "false"){
                if(japczan !== 0){
                    japczan = 0;
                }
            }else if(status == "true"){
                if(japczan !== 1){
                    japczan = 1;
                    streamLive(displayname, thumbnail, title, nick);
                }
            }
        }
    /*-----------
        POPO
    -------------*/
    else if(nick === 'popo'){
        if(status == "false"){
            if(popo !== 0){
                popo = 0;
            }
        }else if(status == "true"){
            if(popo !== 1){
                popo = 1;
                streamLive(displayname, thumbnail, title, nick);
            }
        }
    }
    /*-----------
       DEJVID
    -------------*/
    else if(nick === 'dejvid'){
        if(status == "false"){
            if(dejvid !== 0){
                dejvid = 0;
            }
        }else if(status == "true"){
            if(dejvid !== 1){
                dejvid = 1;
                streamLive(displayname, thumbnail, title, nick, 'YouTube', globalConfig.dejvid);
            }
        }
    }
    /*-----------
       LUKISTEVE
    -------------*/
    else if(nick === 'lukisteve'){
        if(status == "false"){
            if(lukisteve !== 0){
                lukisteve = 0;
            }
        }else if(status == "true"){
            if(lukisteve !== 1){
                lukisteve = 1;
                streamLive(displayname, thumbnail, title, nick);
            }
        }
    }
    /*-----------
        HOLAK
    -------------*/
    else if(nick === 'holak'){
        if(status == "false"){
            if(holak !== 0){
                holak = 0;
            }
        }else if(status == "true"){
            if(holak !== 1){
                holak = 1;
                streamLive(displayname, thumbnail, title, nick);
            }
        }
    }
    /*-----------
        AKI
    -------------*/
    else if(nick === 'aki'){
        if(status == "false"){
            if(aki !== 0){
                aki = 0;
            }
        }else if(status == "true"){
            if(aki !== 1){
                aki = 1;
                streamLive(displayname, thumbnail, title, nick);
            }
        }
    }
    /*-----------
        vysotzky
    -------------*/
    else if(nick === 'vysotzky'){
        if(status == "false"){
            if(vysotzky !== 0){
                vysotzky = 0;
            }
        }else if(status == "true"){
            if(vysotzky !== 1){
                vysotzky = 1;
                streamLive(displayname, thumbnail, title, nick);
            }
        }
    }
    /*-----------
       mlodziutki7
    -------------*/
    else if(nick === 'mlodziutki7'){
        if(status == "false"){
            if(mlodziutki7 !== 0){
                mlodziutki7 = 0;
            }
        }else if(status == "true"){
            if(mlodziutki7 !== 1){
                mlodziutki7 = 1;
                streamLive(displayname, thumbnail, title, nick);
            }
        }
    }
    /*-----------
       dejvid_tibijski
    -------------*/
    else if(nick === 'dejvid_tibijski_zadymiarz'){
        if(status == "false"){
            if(dejvid_tibijski_zadymiarz !== 0){
                dejvid_tibijski_zadymiarz = 0;
            }
        }else if(status == "true"){
            if(dejvid_tibijski_zadymiarz !== 1){
                dejvid_tibijski_zadymiarz = 1;
                streamLive(displayname, thumbnail, title, nick);
            }
        }
    }}
    setInterval(check, 60*1000);
    
    function streamLive(displayname, thumbnail, title, nick, platform, ytchannelID) {
        console.log(displayname)
        
      io.sockets.emit('XI_Alert', {
        stream: displayname,
        thumbnail: thumbnail,
        title: title,
        channel_id: nick,
        platform: platform,
        ytchannelID: ytchannelID
      });

      io.sockets.emit('xd', {streams: onlineStreams()});
    }
/*--------------------------------------------------------------------------------------------
                                              SOCKET
---------------------------------------------------------------------------------------------*/
io.on('connection', function (socket) {

    var $ipAddress = socket.handshake.headers['x-forwarded-for'];

    if (!users.hasOwnProperty($ipAddress)) {
  
        users[$ipAddress] = 1;
  
      
      socket.emit('xd', { streams: onlineStreams() });
  
    }
  
    /* Disconnect socket */
  
    socket.on('disconnect', function() {
  
        if (users.hasOwnProperty($ipAddress)) {
  
            delete users[$ipAddress];
  
        }
      
    });
  /*--------------------------------------------------------------------------------------------
                                            STATUS
  ---------------------------------------------------------------------------------------------*/
  socket.on('wedaj', (data) => {
    socket.emit('xd', {streams: onlineStreams() });
  });
});
http.listen(port, function() {
    console.log('listening on *:3000');
});