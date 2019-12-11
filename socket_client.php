<html lang="en">

<head>
    <title>WebSocket</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="public.css">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <style>
        html,
        body {
            font: normal 0.9em arial, helvetica;
        }

        .dPanel {
            width: 100%;
            height: 200px;
            /* overflow: auto; */
            border: 1px solid black;
        }

        .row {
            padding-top: 12px;
            padding-bottom: 12px;
        }

        #msg {
            width: 100%;
        }

        .systemmessage {
            border: solid 1px #969494;
            background-color: #d6d2d2;
        }

        .message {
            border: solid 1px #969494;
            background-color: #6cc24c;
        }

        .logmessage {
            border: solid 1px #969494;
            background-color: #a3bdbf;
        }
    </style>
    <script src="wsc.js"></script>
</head>

<body onload="init()" class="text-center">
    <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <div class="container">
            <div class="row">
                <div class="col-12 offset-xl-2 col-xl-8">
                    <main role="main" class="inner cover">
                        <div class="card">
                            <div class="card-header">
                                WebSocketC v0.1 <span id="myid"></span>
                            </div>
                            <div class="card-body">
                                <div class="container">
                                    <div class="row">
                                        <div class="col-8">
                                            <div class="dPanel" id="logs" style="text-align: left;"></div>
                                        </div>
                                        <div class="col-4">
                                            <div class="dPanel" style="padding: 5px;" id="users">
                                                <div id="userselect" class="card">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12">
                                        <div class="input-group mb-3">
                                            <input id="inputmessage" type="textbox" onkeypress="onkey(event)" class="form-control" placeholder="mensagem">
                                            <div class="input-group-append">
                                                <button class="btn btn-primary" type="button" id="button-addon2" onclick="sendMessage()">Enviar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    </div>
</body>
<script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>

</html>