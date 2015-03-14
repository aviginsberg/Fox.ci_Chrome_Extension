chrome.commands.onCommand.addListener(function(command){ // Keyboard shortcut trigger - Shorten current tab
	if(command == "shortenTab"){
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			var current = tabs[0]
			shortenTabURL(current.id);
		});
	}
});

chrome.browserAction.onClicked.addListener(function(tab){ // Shorten current tab when icon pressed
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		var current = tabs[0]
		shortenTabURL(current.id);
	});
});


function showAlert(text){
	var opt = {
		type: "basic",
		title: "Fox.ci URL Shortener",
		message: text,
		iconUrl: "../icons/icon128.png"
	}
	chrome.notifications.create('foxci-chrome', opt, function(id){});
}

function copyToClipboard(text){
	var clipboard = document.getElementById("clipboard");
	clipboard.value = text;
	clipboard.focus();
	clipboard.select();
	document.execCommand("copy");
}

function testURL(s) { // Stolen from http://stackoverflow.com/a/17726973 since I suck at RegExp - Returns true(bool) on good looking link
    var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(s);    
}

function shortenTabURL(tabid){ // Use just a tab id to shorten its url
	chrome.tabs.get(tabid, function(tab){
		shortenURL(tab.url);
	});
}

function shortenURL(url){ // Creates a short url and copies it to clipboard
	if(testURL(url)){
		//var url = encodeURIComponent(url);
		sendAPIRequest("?url=" + url, function(req){
			var res = JSON.parse(req);
			var status = res.statuscode;
			var linkID = res.shortcode;

			switch(status){
				case "100": // Sucessful new shorten
					copyToClipboard("http://fox.ci/"+linkID);
					showAlert("Link shortened. Short link copied to clipboard!\nYour link is: http://fox.ci/"+linkID);
					break;
				case "101": // Sucessful lookup of existing link
					copyToClipboard("http://fox.ci/"+linkID);
					showAlert("Existing link found - Short link copied to clipboard!\nYour link is: http://fox.ci/"+linkID);
					break;
				case "201": // No URI provided - /Should/ never show up here
					showAlert("It appears that you didn't submit a link to fox.ci.\nTry again?");
					break;
				case "202": // Attempted to shorten unsupported URI - As of 3/13/2015 http(s) only
					showAlert("You tried to shorten an unsupported URL.\nhttp and https links only please.");
					break;
				case "203": // URL failed to resolve - Host could be down, or formatting problem
					showAlert("Unable to verify your link exists. Is it online?");
					break;

				default: // Unexpected response from server, has the API been updated?
					showAlert("I got an unexpected response.\nThis could be a hiccup in the network, or the API has changed.");
					break;
			}
		});
	}
}

function sendAPIRequest(url, callback){ // Sends a GET request to the server
	var req = new XMLHttpRequest();
	req.open(method, "http://fox.ci/api/" + url, true);
	req.onload = function(){
		callback(req);
	};
	req.send();
}