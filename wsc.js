var socket;
var listUsers = [];
var myID = 0;

function init() {
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
                
                console.log(msg.data);

                if (source == 'server') {
                    !checkIDAttr(message);
                    !checkIDNew(message);
                }
                
                log('message', source + " say: " + message);
               
            } catch (e) {
            }
            updateUserList();
        };
        socket.onclose = function (msg) {
            log('status', "Disconnected - status " + this.readyState);
        };
    } catch (ex) {
        log('status', ex);
    }
    $("#msg").focus();
}

function send() {
    var txt, msg;
    txt = $("#inputmessage")[0];
    msg = txt.value;
    if (!msg) {
        alert("Message can not be empty");
        return;
    }
    txt.value = "";
    txt.focus();
    try {
        var msgObj  = {};
        msgObj.type = "forall";
        msgObj.text = msg;
        msgObj.addr = "1234";

        jsmsg = JSON.stringify(msgObj);
        log('self', msg);
   
        
        socket.send(jsmsg);
    } catch (ex) {
        log('status', ex);
    }
}

function checkIDAttr(message) {
    var regexp = /(?:^|\s)Welcome, your current ID is:\s(\d+)/g;
    let myID = parseInt(regexp.exec(message)[1]);
    if (myID) {
        $("#myid").text("[identificador: " + myID + "]");
        listUsers.push(['my', myID]);
        return true;
    }
    return false;
}
function checkIDNew(message) {
    var regexp = /(?:^|\s)New user in the room:\s(\d+)/g;
    let newID = parseInt(regexp.exec(message)[1]);
    if (newID) {
        listUsers.push(['user', newID]);
        return true;
    }
    return false;
}

function tableListUpdate(element, index, array) {
    let newUser = $('<div>' + element[0] + element[1] + '</div>');
    $("#users").append(newUser);
}

function updateUserList() {
    console.log("novo");
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