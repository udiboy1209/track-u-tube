var links = ["quora", "gmail", "facebook", "instagram", "linkedin", "foursquare", "orkut"];
var count = 0;

function contains(main, target) {
	var i,j,flag = false;
	for(i=0; i<main.length; i++) {
		for(j=1; j<=main.length; j++) {
			if(target === main.substring(i, j)) {
				flag = true;
			}
		}
	}
	return flag;
}

function socNotifier(){
	var q = "You are currently logged in into ";
	var queryInfo = {
		'currentWindow': true
	};
	chrome.tabs.query(queryInfo, function(tabs) {
		for(var i=0;i<tabs.length;i++){
			for(var j=0;j<links.length;j++){
				//console.log(links[j]);
				if(contains(tabs[i].url.toString(),(links[j]))){
					count++;
					q = q + links[j] + ",";
					console.log(q);
				}
			}
		}
		if(count!=0){
			alert(q.substring(0,q.length-1));
		} else {
			alert("You are not logged into any sites :) !!");
		}
	});
}
chrome.browserAction.onClicked.addListener(socNotifier);