var socket;
var listUsers   = [];
var myCurrentId = 0;

function init() {
    listUsers.push(['todos', '9999']);
    var host = "ws://127.0.0.1:1227";
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
                            console.log(commando['users']);
                            commando['users'].forEach(adduser);
                            break;
                        case 'set_user':
                            myCurrentId = commando['id'];
                            $("#myid").text("[identificador: " + myCurrentId + "]");
                            break;
                    }
                    updateUserList();
                }
                log('message', source + " say: " + message);
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
    listUsers.push(['user ' + item, item]);
}

function send() {
    //carrega a mensagem
    var inputmessage, message;
    inputmessage = $("#inputmessage")[0];
    message = inputmessage.value;
    if (!message) {
        alert("Message can not be empty");
        return;
    }
    //limpa o campo
    inputmessage.value = "";
    inputmessage.focus();

    //seleciona o destino
    var user = $("input[type='radio'][name='user']:checked").val();

    //monta o objeto para enviar ao servidor
    try {
        var msgObj = {};
        msgObj.destination = user;
        msgObj.message     = message;
        msgObj.source      = myCurrentId;

        jsmsg = JSON.stringify(msgObj);        
        socket.send(jsmsg);
    } catch (ex) {
        log('status', ex);
    }
}

function tableListUpdate(element, index, array) {
    $t = '<div style="align-self:start;padding:4px;"><input type="radio" name="user" value=' + element[1] + '>' + element[0] + '    [' + element[1] + ']</input></div>'
    let newUser = $($t);
    $("#userselect").append(newUser);
}

function updateUserList() {
    var user = $("input[type='radio'][name='user']:checked").val();
    console.log('usuario atual: ' + user);
    $("#userselect").empty();
    listUsers.forEach(tableListUpdate);
}


function log(type, msg) {
     let newElement = $('<div>' + msg + '</div>');
    switch (type) { 
        case 'message':
            newElement.css("background-color", "yellow");
            break;
        case 'self':
            newElement.css("background-color", "green");
            break;
        case 'status':
            newElement.css("background-color", "red");
            break;
    }
    $("#logs").append(newElement);
}

function onkey(event) {
    if (event.keyCode == 13) {
        send();
    }
}