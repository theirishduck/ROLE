/**
 * Cam Widget
 * This JavaScript file is for Canvas view.
 */

function init() {
    // TODO: Write the code for initializing.
}

function getSelection() {
	var selection;
	if(document.camform.selection[0].checked == true) {
    	selection = document.camform.selection[0].value;
  	}
  	else if(document.camform.selection[1].checked == true) {
    	selection = document.camform.selection[1].value;
    }
  	else if(document.camform.selection[2].checked == true) {
    	selection = document.camform.selection[2].value;
    }			
	return selection;
}

//function callback(sender, message) {
//	var storagemode = getSelection();
//	var message = gadgets.util.escapeString(message + "");
//	var sender = gadgets.util.escapeString(sender);
//	var timestamp = new Date().getTime();
//    javascript:store(storagemode, message, sender, timestamp);
//}

// TODO how do i access envelope.date?
function callback(envelope, message) {
	// Filter out select events
	if (envelope.event === "select") {
		// Require namespaced-properties
		if (envelope.type === "namespaced-properties") {
			// Require rdf:type to be a word
			if (message[gadgets.openapp.RDF + "type"] === "http://example.com/rdf/Word") {
				//var item = document.createElement("div");
				//item.appendChild(document.createTextNode(message[gadgets.openapp.RDF + "label"]));
				//document.getElementById("output").appendChild(item);
				var storagemode = getSelection();
				var message = message[gadgets.openapp.RDF + "label"];
				var sender = "";
				var timestamp = new Date().getTime();
				javascript:store(storagemode, message, sender, timestamp);
			}
		}
	}
}

// TODO: Use correct CAM Schema
function store(storagemode, message, sender, timestamp)
{
	if (storagemode == 'local') {
		var db = google.gears.factory.create('beta.database');
		db.open('database-test');
		db.execute('create table if not exists TestCam (Storagemode text, Message text, Sender text, Timestamp int)');
		db.execute('insert into TestCam values (?, ?, ?, ?)', [storagemode, message, sender, timestamp]); 
		rs.close();	
	}
	else if (storagemode == 'remote') {
		var params = 'storagemode=' + storagemode + '&message=' + message + '&sender=' + sender + '&timestamp=' + timestamp;
		var url = 'http://duccio.informatik.rwth-aachen.de:9080/axis2/services/RemoteCamStorageService/storeCamToDB';
		var xmlHttp = null;
		try {
		      // Mozilla, Opera, Safari sowie Internet Explorer (ab v7)
		      xmlHttp = new XMLHttpRequest();
		} catch(e) {
			alert('request failed' + e);
		}
		xmlHttp.open("GET", url + '?' + params, true); 
		xmlHttp.send(null);
	}
} 

function query(limit)
{
	var db = google.gears.factory.create('beta.database');
	db.open('database-test');
	var rs = db.execute('select * from TestCam order by Timestamp desc limit ' + limit);
	var result = "";
	while (rs.isValidRow()) {
	  var wert = "" +  rs.fieldByName("Storagemode") + " " + rs.fieldByName("Message") + " " + rs.fieldByName("Sender") + " " + rs.fieldByName("Timestamp") + "\n";
	  result = result + wert;
	  rs.next();
	}
	rs.close();
	alert(result);
}

