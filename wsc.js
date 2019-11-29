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
                let source   = jMessage['source'];
                
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

    console.log($("select_user"));
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
    let rg = regexp.exec(message);
    if (rg) {
        let myID = rg[1];
         if (!checkUserExist(myID)) {
            $("#myid").text("[identificador: " + myID + "]");
            listUsers.push(['me', parseInt(myID)]);
            return true;
        }
    }
    return false;
}

function checkIDNew(message) {
    var regexp = /(?:^|\s)New user in the room:\s(\d+)/g;
    let rg = regexp.exec(message);
    if (rg) { 
        let newID = rg[1];
        if (!checkUserExist(newID)) {
            listUsers.push(['user', newID]);
            return true;
         }
    }
    return false;
}

function checkUserExist(newUserID) {
    for (let index = 0; index < listUsers.length; index++) {
        let currentUser = listUsers[index];
        console.log("testando " + newUserID + " -- type " + currentUser[0] + " ID " + currentUser[1]);

        if (currentUser[1] == newUserID) { 
            if (currentUser[0] == 'me') {
                console.log("WWWWWWWWWWWOWWWWWWWW sou eu");
            } else { 
                console.log("já cadastrado");
            }
            return true;
        }
    }
    return false;
}

function tableListUpdate(element, index, array) {


    $t = '<div class="input-group" style="border:solid 1px gray; margin-top:4px" ><div class="input-group-prepend"><div class="input-group-text"><input type="radio" name="select_user"></div></div> <div style="align-self: center;text-align: center;padding-left:12px">' +
        element[0] + " : " + element[1]
        + '</div> </div>';
                
    let newUser = $($t);
    // let newUser = $('<div> <input type="radio" name="favorite_pet" value="Cats" checked>'+'<li class="list-group-item">Cras justo odio</li></div>');
    // let newUser = $('<div>' + element[0] + " : "+ element[1] + '</div>');
    $("#users").append(newUser);
}

function updateUserList() {
    $("#users").empty();
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