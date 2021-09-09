const axios = require('axios');
const globalConfig = require('./config/config.js');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var geoip = require('geoip-lite');
const yt = require('@3xanax/youtube-stream-status');

var port = process.env.PORT || 3000
var users = [];
var lastInitLogin = 0;
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
var ile_lat_ma_xayoo = 0;

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
            "STATUS": ${ile_lat_ma_xayoo}, 
            "CHANNEL_ID": "ile_lat_ma_xayoo", 
            "TWITCH" : "ile_lat_ma_xayoo"
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
    zapytaj(globalConfig.ile_lat_ma_xayoo, 'ile_lat_ma_xayoo')
}
/*--------------------------------------------------------------------------------------------
                                        DANE OD TTV
---------------------------------------------------------------------------------------------*/
function zapytaj(id, nick){

    const options = {
        headers: {
            'Client-ID': 'iykoz4spfmv27zc1apjkxv167e9e01',
            'Authorization': 'Bearer pwxgmnsj6l5rlp5h8umq8zenn2d1pv',
            'Accept': 'application/vnd.twitchtv.v5+json'
        }
    };

    axios.get(`https://api.twitch.tv/kraken/streams/${id}`, options).then(
        (response) => {
            var data = response.data;

            if(response.data.stream === null || !response.data.stream){
                zapytajLive(nick, 'false');
            }else{
                zapytajLive(nick, 'true', data.stream.preview.large, data.stream.channel.status, data.stream.channel.display_name);
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
       ile_lat_ma_xayoo
    -------------*/
    else if(nick === 'ile_lat_ma_xayoo'){
        if(status == "false"){
            if(ile_lat_ma_xayoo !== 0){
                ile_lat_ma_xayoo = 0;
            }
        }else if(status == "true"){
            if(ile_lat_ma_xayoo !== 1){
                ile_lat_ma_xayoo = 1;
                streamLive(displayname, thumbnail, title, nick);
            }
        }
    }}
    setInterval(check, 60*1000);
    
    function streamLive(displayname, thumbnail, title, nick, platform, ytchannelID) {
        
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

    if(geoip.lookup($ipAddress).country !== 'PL'){
        socket.emit('XI_NOT_POLAND', { request: true });
    }

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
                                            DISCORD
  ---------------------------------------------------------------------------------------------*/
  socket.on('catch', (data) => {
    const ip = socket.handshake.headers['x-forwarded-for'] || socket.conn.remoteAddress.split(":")[3];
    if (lastInitLogin > (Date.now() - 4000)) {
      return;
    }
    lastInitLogin = Date.now();
    xayooevery(`» ${data.tresc}\n» ${ip}`);
  });
  /*--------------------------------------------------------------------------------------------
                                            STATUS
  ---------------------------------------------------------------------------------------------*/
  socket.on('wedaj', (data) => {
    socket.emit('xd', {streams: onlineStreams() });
  });
});
/*--------------------------------------------------------------------------------------------
                                            FUNKCJE
---------------------------------------------------------------------------------------------*/
function xayooevery(tresc) {
  io.sockets.emit('everything', {
    tresc: tresc
  });
}
http.listen(port, function() {
    console.log('listening on *:3000');
});