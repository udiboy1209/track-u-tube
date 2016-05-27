function getIDs(data){
	var items = [];
	for(i in data.items){
		items.push(data.items[i].id.videoId.toString());
	}
	for(i in items){
		$('<p>'+items[i]+'</p><br>').appendTo('#results');
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
			return data;
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
});
