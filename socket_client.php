<html>

<head>
    <title>WebSocket</title>

    <link rel="stylesheet" href="public.css">
    <script type="text/javascript" src="wsc.js"></script>
</head>

<body onload="init()">
    <h3>WebSocketC v0.1</h3>
    <div id="log"></div>
    <input id="msg" type="textbox" onkeypress="onkey(event)" />
    <button onclick="send()">Send</button>
    <!-- <button onclick="quit()">Quit</button> -->
</body>

</html>