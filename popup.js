function getIDs(data){
	var items = [];
	for(i in data.items){
            var x = data.items[i].id.videoId.toString();
            items.push(x);
            index = i.toString();
          chrome.storage.sync.set({index: x},function(){
          alert('Settings saved');
         }); 	}
	for(i in items){
	index = i.toString();
		chrome.storage.sync.get(index, function(obj){
        $('<p>'+obj.index+'</p><br>').appendTo('#results');
		
		});
		
	}
}

function getVideo(searchQuery){
	searchQuery = searchQuery.replace(/ /g,'+');
	var queryURL = 'https://www.googleapis.com/youtube/v3/search?q='+searchQuery+'&key=AIzaSyDq5SqWuQIEfIx7ZlQyKcQycF24D8mW798&part=snippet&maxResults=3&type=video';
	$.ajax({
		url: queryURL,
		dataType: 'json',
		success: function(data) {
			getIDs(data);
		},
		error: function(){
			alert('Error Occured');
		}
	});
}

document.addEventListener('DOMContentLoaded',function(){
	var button = document.getElementById('search');
	var div = document.getElementById('results');
	button.addEventListener('click',function(){
		var base_url = 'https://www.youtube.com/watch?v=';
		var url = [];
		var input = document.getElementById('input');
		var result = input.value;
		if(result === "")
			result = "Default";
		getVideo(result);
	});
        button.click();
});
