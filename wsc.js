var socket;
// {"type":"forall","text":"ol","addr":"212"}
function init() {
    var host = "ws://127.0.0.1:1227";
    try {
        socket = new WebSocket(host);
        log('WS status ' + socket.readyState);

        socket.onopen = function (msg) {
            log("WS connected: " + this.readyState);
        };
        socket.onmessage = function (msg) {
            try {
                let jMessage = JSON.parse(msg.data);
                log(jMessage['source']+ " say: " + jMessage['message']);
            } catch (e) { 

            }
        };
        socket.onclose = function (msg) {
            log("Disconnected - status " + this.readyState);
        };
    } catch (ex) {
        log(ex);
    }
    $("msg").focus();
}

function send() {
    var txt, msg;
    txt = $("msg");
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
        console.log(jsmsg);
   
        
        socket.send(jsmsg);
        // log('Sent: ' + msg);
    } catch (ex) {
        log(ex);
    }
}

function quit() {
    log("Goodbye!");
    socket.close();
    socket = null;
}

// Utilities
function $(id) {
    return document.getElementById(id);
}

function log(msg) {
    $("log").innerHTML += "<br>" + msg;
}

function onkey(event) {
    if (event.keyCode == 13) {
        send();
    }
}