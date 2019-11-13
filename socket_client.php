<html lang="en">

<head>
    <title>WebSocket</title>
    <meta charset="utf-8">
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
    </style>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
    <script src="wsc.js"></script>

</head>

<body onload="init()" class="text-center">

    <!-- <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column" style="background:#941894"> -->
    <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <div class="container">
            <div class="row">
                <div class="offset-2 col-8">
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
                                            <div class="dPanel" id="users">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-10">
                                        <input id="inputmessage" type="textbox" onkeypress="onkey(event)" />
                                    </div>
                                    <div class="col-2">
                                        <button onclick="send()">Send</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
                </main>
            </div>

        </div>
    </div>
</body>

</html>