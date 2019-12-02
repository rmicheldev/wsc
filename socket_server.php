<?php	/*	>php -q server.php	*/

error_reporting(E_ALL);
set_time_limit(0);
ob_implicit_flush();

$address      = "127.0.0.1";
$port         = "1227";
$clients      = [];
$logs         = [];
$logs         = [];
$messageQueue = [];
$ping         = false;


// socket creation
$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
socket_set_option($socket, SOL_SOCKET, SO_REUSEADDR, 1);

if (!is_resource($socket))
	printf("%s: %s\n", "socket_create() failed", socket_strerror(socket_last_error()));

if (!socket_bind($socket, $address, $port))
	printf("%s: %s\n", "socket_bind() failed", socket_strerror(socket_last_error()));

if (!socket_listen($socket, 5))
	printf("%s: %s\n", "socket_listen() failed", socket_strerror(socket_last_error()));


// Start listening for connections
socket_listen($socket);
socket_set_nonblock($socket);

$refTime = round(microtime(true));

do {
	screenUpdate();
	if ($client = socket_accept($socket)) {
		if (is_resource($client)) {
			// Non bloco for the new connection
			socket_set_nonblock($client);

			// Append the new connection to the clients array
			$newClient['id']        = rand(1000, 9999);
			$newClient['socket']    = $client;
			$newClient['handshake'] = false;
			$clients[] = $newClient;

			createLog('server', $newClient['id'], "New client");
		}
	}

	// Polling for new messages
	if (count($clients)) {
		foreach ($clients as $k => &$clientItem) {
			// Check for new messages
			checkHandshake($clientItem);

			if ($clientItem["handshake"] == true) {

				$bytes = @socket_recv($clientItem['socket'], $data, 2048, MSG_DONTWAIT);
				if ($data != "") {
					$decoded_data = unmask($data);
					getMessage($clientItem['id'], $decoded_data);
					// socket_close($sockClient);
				}
			}
		}

		if ($ping) {
			$ping = false;
			newMessage('server', 'all', 'ping');
		}
		sendMessages();
	}

	usleep(1000000);
	$currentTime = round(microtime(true));
	$diffTime    = $currentTime - $refTime;
	if ($diffTime >= 10) {
		   $refTime = $currentTime;
		//    $ping    = true;
	}

} while (true);

socket_close($socket);

function getMessage($source, $message){
	$jMessage = json_decode($message, true);
	if(!$jMessage){
		newMessage('server', $source, "Error on get message");	
	}else{
		$type = $jMessage['type'];
		$addr = $jMessage['addr'];
		$text = $jMessage['text'];
		switch($type){
			case 'all':
				newMessage($source, 'all', $text);
				break;
			case 'echo':
				newMessage($source, $source, $text);
				break;
			case 'direct':
				newMessage($source, $addr, $text);
				break;
		}
		
	}
}


function checkHandshake(&$clientItem){
	if ($clientItem["handshake"] == false) {
		createLog('server', $clientItem['id'], "Running handshake");

		$string = '';
		if ($char = socket_read($clientItem['socket'], 1024)) {
			$string .= $char;
			if (strlen($string) == 0) {
				createLog('server', $clientItem['id'], "Error on handshake");
			}
			
			// printf("\nHandshaking headers from client: %s", $string);
			if (doHandshake($clientItem, $string)) {
				$clientItem["handshake"] = true;
				$id = $clientItem['id'];
				newMessage('server', $id, "Welcome, your current ID is: {$id}");
				newMessage('server', 'all', "New user in the room: {$id}");
			}
		}
	} 	
}

function doHandshake($client, $headers){
	if (preg_match("/Sec-WebSocket-Version: (.*)\r\n/", $headers, $match))
		$version = $match[1];
	else {
		createLog('server', $client['id'], "Client don't support handshake");
		return false;
	}

	if ($version == 13) {
		// Extract header variables
		if (preg_match("/GET (.*) HTTP/", $headers, $match))
			$root = $match[1];
		if (preg_match("/Host: (.*)\r\n/", $headers, $match))
			$host = $match[1];
		if (preg_match("/Origin: (.*)\r\n/", $headers, $match))
			$origin = $match[1];
		if (preg_match("/Sec-WebSocket-Key: (.*)\r\n/", $headers, $match))
			$key = $match[1];

		$acceptKey = $key . '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
		$acceptKey = base64_encode(sha1($acceptKey, true));

		$upgrade = "HTTP/1.1 101 Switching Protocols\r\n" .
			"Upgrade: websocket\r\n" .
			"Connection: Upgrade\r\n" .
			"Sec-WebSocket-Accept: $acceptKey" .
			"\r\n\r\n";

		socket_write($client['socket'], $upgrade);
		return true;
	} else {
		createLog('server', $client['id'], "WebSocket version 13 required (the client supports version {$version})");
		return false;
	}
}

function unmask($payload){
	$length = ord($payload[1]) & 127;
	if ($length == 126) {
		$masks = substr($payload, 4, 4);
		$data = substr($payload, 8);
	} elseif ($length == 127) {
		$masks = substr($payload, 10, 4);
		$data = substr($payload, 14);
	} else {
		$masks = substr($payload, 2, 4);
		$data = substr($payload, 6);
	}
	$text = '';
	for ($i = 0; $i < strlen($data); ++$i) {
		$text .= $data[$i] ^ $masks[$i % 4];
	}
	return $text;
}

function encode($text){
	// 0x1 text frame (FIN + opcode) 
	$b1 = 0x80 | (0x1 & 0x0f);
	$length = strlen($text);
	if ($length <= 125)
		$header = pack('CC', $b1, $length);
	elseif ($length > 125 && $length < 65536)
		$header = pack('CCS', $b1, 126, $length);
	elseif ($length >= 65536)
		$header = pack('CCN', $b1, 127, $length);

	return $header . $text;
}

function screenUpdate(){

	global $address;
	global $port;
	global $clients;
	global $logs;

	system('clear');
	printf("Server running on %s:%d\n", $address, $port);
	printf("\rListening... \t\t\t\t\t\t\t[conected clients: %d] ", count($clients));

	foreach ($clients as $k => &$clientItem) {
		printf("\n\t# %s: %s", "client: ", $clientItem['id']);
	}
	printf("\n\n");

	foreach ($logs as $log) {
		if ($log['type'] == 'server') {
			printf("\n#%s :: %s", $log['source'], $log['message']);
		} else {
			printf("\n\t%s says :: %s", $log['source'], $log['message']);
		}
	}
}

function sendMessages(){
	global $messageQueue;
	global $clients;

	foreach($messageQueue as $mItem => $messageQ){
		$source  = $messageQ['source'];
		$dest    = $messageQ['dest'];
		$message = $messageQ['message'];
		
		createLog($source, $dest, $message);

		foreach ($clients as $cItem => $clientItem) {
			if($dest == 'all'){
				$msg['source']  = $source;
				$msg['message'] = $message;
				socket_write($clientItem['socket'], encode(json_encode($msg)));
			}else if ($dest == $clientItem['id']) {
				$msg['source']  = $source;
				$msg['message'] = $message;
				socket_write($clientItem['socket'], encode(json_encode($msg)));
			}
		}
		unset($messageQueue[$mItem]);
	}

}

function newMessage($source, $dest, $message){
	global $messageQueue;

	$messageQ['source']  = $source;
	$messageQ['dest']    = $dest;
	$messageQ['message'] = $message;
	$messageQueue[] = $messageQ;
}

function createLog($type, $id, $message){
	global $logs ;
	$log['type']   = $type;
	$log['source'] = $id;
	$log['message'] = $message;
	$logs[] = $log;	
}