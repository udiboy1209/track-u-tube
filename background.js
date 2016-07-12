var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = "https://apis.google.com/js/client.js?onload=init";
head.appendChild(script);

/*function init(){
	//console.log("Hello");
	gapi.client.setApiKey("AIzaSyDq5SqWuQIEfIx7ZlQyKcQycF24D8mW798");
	/*gapi.client.load("youtube","v3",function(){
		//API is ready 
		console.log("API is ready");

	});
	chrome.identity.getAuthToken({
    interactive: true
}, function(token) {
    if (chrome.runtime.lastError) {
        alert(chrome.runtime.lastError.message);
        return;
    }
    var x = new XMLHttpRequest();
    x.open('GET', 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token);
    x.onload = function() {
        alert(x.response);
    };
    x.send();
});
}*/
