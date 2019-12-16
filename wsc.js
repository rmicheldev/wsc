var socket;
var listUsers   = [];
var myCurrentId = 0;
var radioSelect = '9999';

function init(server) {
    console.log('server '+server);
    var host = "ws://"+server+":1227";
    try {
       
        socket = new WebSocket(host);
        log('status', 'WS status ' + socket.readyState);

        socket.onopen = function (msg) {
            log('status', "WS connected: " + this.readyState);
        };
        socket.onmessage = function (msg) {
            try {
                let jMessage = JSON.parse(msg.data);
                let message  = jMessage['message'];
                let source = jMessage['source'];

                if (source == 'server') {
                    let commando = JSON.parse(message);

                    switch (commando['type']) {
                        case 'users_update':
                            listUsers = [];
                            listUsers.push(['all', '9999']);
                            console.log(commando['users']);
                            commando['users'].forEach(adduser);
                            break;
                        case 'set_user':
                            myCurrentId = commando['id'];
                            $("#myid").text("[identifier: " + myCurrentId + "]");
                            break;
                        case 'ping':
                            console.log("PING");
                            var msgObj = {};
                            msgObj.destination = 'server';
                            msgObj.message = 'pong';
                            msgObj.source = myCurrentId;
                            jsmsg = JSON.stringify(msgObj);
                            socket.send(jsmsg);
                            break;
                    }
                    updateUserList();
                } else { 
                    log('message', '[source: '+ source + "] <= " + message);
                }
                
            } catch (e) {
            }
        };
        socket.onclose = function (msg) {
            log('status', "Disconnected - status " + this.readyState);
        };
    } catch (ex) {
        log('status', ex);
    }
}

function adduser(item, index) {
    if (item == myCurrentId) {
        listUsers.push(['me ' + item, item]);
    } else { 
        listUsers.push(['user ' + item, item]);
    }
}

function sendMessage() {
    //carrega a mensagem
    var inputmessage, message;
    inputmessage = $("#inputmessage")[0];
    message = inputmessage.value;
    inputmessage.focus();
    if (!message) {
        alert("the message can't be empty");
        return;
    }
    //limpa o campo
    inputmessage.value = "";

    //seleciona o destino
    var user = $("input[type='radio'][name='user']:checked").val();
     if (!user) {
         alert("select destination");
         return;
     }

    //monta o objeto para enviar ao servidor
    try {
        var msgObj = {};
        msgObj.destination = user;
        msgObj.message     = message;
        msgObj.source      = myCurrentId;

        jsmsg = JSON.stringify(msgObj);        
        socket.send(jsmsg);
        log('self','[destino: ' + user + '] => ' + message);
    } catch (ex) {
        log('status', ex);
    }
}

function tableListUpdate(element) {
    $t = '<div style="align-self:start;padding:4px;"><input type="radio" name="user" value=' + element[1] + '>' + element[0] + '    [' + element[1] + ']</input></div>'
    let newUser = $($t);
    $("#userselect").append(newUser);
}

function updateUserList() {
    $("#userselect").empty();
    listUsers.forEach(tableListUpdate);

    $("input[type='radio'][name='user'][value='"+radioSelect +"']").prop('checked', true);
    listenRadio();

}


function log(type, msg) {
     let newElement = $('<div>' + msg + '</div>');
    switch (type) { 
        case 'message':
            newElement.addClass('message')
            break;
        case 'self':
            newElement.addClass('logmessage');
            break;
        case 'status':
            newElement.addClass('systemmessage');
            break;
    }
    $("#logs").append(newElement);
}

function onkey(event) {
    if (event.keyCode == 13) {
        sendMessage();
    }
}

function listenRadio() { 
    $('input[type=radio][name=user]').change(function () {
        radioSelect = this.value;
    });
}