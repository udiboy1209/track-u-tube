var API_key = 'AIzaSyDq5SqWuQIEfIx7ZlQyKcQycF24D8mW798';
var ids;
var cl_id = '856154260669-drv0jdct8udp514ojulg50mofsvgqgf5.apps.googleusercontent.com	';
var pl_names = [];
var pl_ids = [];
var name = '';
var access
var vid_ids =[];
var button_ids = [];
function xhrWithAuth(method, url, interactive, callback) {
    var access_token;

    var retry = true;

    

    function getToken() {
      chrome.identity.getAuthToken({ interactive: interactive }, function(token) {
        if (chrome.runtime.lastError) {
          callback(chrome.runtime.lastError);
          return;
        }

        access_token = token;
        access = token;
        requestStart();
      });
    }

    function requestStart() {
      var xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
      xhr.onload = requestComplete;
      xhr.send();
    }

    function requestComplete() {
      if (this.status == 401 && retry) {
        retry = false;
        chrome.identity.removeCachedAuthToken({ token: access_token },
                                              getToken);
      } else {
        callback(null, this.status, this.response);
      }
    }

    getToken();
}

function addVideo(video_id,playlist_id) {
	var queryURL = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&key='+API_key;
	$.ajax({
		url: queryURL,
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({"snippet":{"playlistId":playlist_id , "resourceId": {"kind": "youtube#video" , "videoId" : video_id }}}),
		beforeSend: function(xhr) {
			xhr.setRequestHeader('Authorization','Bearer '+ access);
		}
	}).done(function(data){
		onVideoAdded(data);
	}).fail(function(ts){
		alert(ts);
	});
}

function onVideoAdded(data) {
	alert('Added Successfully!!');
}

function getPlaylists(interactive) {
  	//document.getElementById('results').innerHTML="";
    xhrWithAuth('GET',
                'https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true',
                interactive,
                onPlaylistInfoFetched);
}

function getUserInfo(interactive) {
	xhrWithAuth('GET',
                'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
                interactive,
                onUserInfoFetched);
}


function onPlaylistInfoFetched(error, status, response) {
    if (!error && status == 200) {
      var playlist_info = JSON.parse(response);
      var pl_items=[];
      var pl_id = [];
      for(i in playlist_info.items){
      	pl_items.push(playlist_info.items[i].snippet.title.toString());
	  } 
	  pl_names = pl_items;
	  for(i in playlist_info.items){
	  	pl_id.push(playlist_info.items[i].id.toString());
	  }
	  pl_ids = pl_id;
		/*for(i in pl_items){
	  	$('<p>'+ pl_items[i]+'</p><br>').appendTo('#results');
	  } */
    } else {
      console.log(error);
    }
}

function onUserInfoFetched(error, status, response){
	if(!error && status == 200){
		var user_data = JSON.parse(response);
		name = user_data.given_name.toString();
		$('#sgnin').text('Welcome, '+name+'!');
		getPlaylists(false);
	} else {
		console.log(error);
	}
}

/*function onPlaylistClicked(button_num,pl_num){
	addVideo(vid_ids[button_num],pl_ids[pl_num]);
}*/


function getIDs(data){
	document.getElementById('results').innerHTML="";
	vid_ids = [];
	var names = [];
	var thumbnails = [];
	var channel = [];
	var playlist = '';
	for(i in data.items){
		vid_ids.push(data.items[i].id.videoId.toString());
		names.push(data.items[i].snippet.title.toString());
		thumbnails.push(data.items[i].snippet.thumbnails.default.url.toString());
		channel.push(data.items[i].snippet.channelTitle.toString());
	}
	for(var k=0; k<4; k++){
		for(j in pl_names){
			playlist+='<a href="#" id="Link_'+k+j+'">'+pl_names[j]+'</a>';
			button_ids.push(''+k+j);
		}
		if(pl_names.length!=0) {
			$('<div align="left"><font face=adamcg><img style = "float: left; margin: 0px 15px 15px 0px;" src="'+thumbnails[k]+'" align = "top"/>'/*<a href="http://www.youtube.com/watch?v='+items[i]+'">'*/+ names[k] + '</div></font><br><font color="white" face=adamcg>'+channel[k]+
			'</font><div class="dropdown"><button class="dropbtn" id="'+k+'">Add To..</button><div class="dropdown-content">'+playlist+'</div></div><br><br><br><br><br><br><br>').appendTo('#results');
		} else {
			$('<div align="left"><font face=adamcg><img style = "float: left; margin: 0px 15px 15px 0px;" src="'+thumbnails[k]+'" align = "top"/>'/*<a href="http://www.youtube.com/watch?v='+items[i]+'">'*/+ names[k] + '</div></font><br><font color="white" face=adamcg>'+channel[k]+
			'</font><div class="dropdown"><button class="dropbtn">Add To..</button><div class="dropdown-content">No Playlists Available</div></div><br><br><br><br><br><br><br>').appendTo('#results');
		}
		playlist = '';
	}
	for(var i=0; i<4; i++)
		for(var l=0; l<pl_names.length; l++){
			document.getElementById('Link_'+i+l).addEventListener('click',function(e) {
				e.preventDefault();
				var a = parseInt($(this).attr('id').charAt(5));
				console.log(a);
				var b = parseInt($(this).attr('id').charAt(6));
				console.log(b);
				addVideo(vid_ids[a],pl_ids[b]);
			})
		}
}

function getVideo(searchQuery){
	searchQuery = searchQuery.replace(/ /g,'+');
	var queryURL = 'https://www.googleapis.com/youtube/v3/search';
	$.ajax({
		url: queryURL,
		cache: false,
		dataType: 'json',
		method: 'GET',
		data :{
			q: searchQuery,
			key: API_key,
			part: 'snippet',
			maxResults: 4,
			type: 'video' 
		}
	}).done(function(data){
		ids = data;
	}).promise().then(function(){
		getIDs(ids);
	}).fail(function(ts){
		console.log(ts);
	});
}

function revokeToken(){
	document.getElementById('results').innerHTML = "";
	$('#results').attr('height','0px');
	$('#sgnin').text('Sign In');
	$('#sgnin').attr('cursor','pointer');
	$('#sgnin').attr('color', '#57575c');
	chrome.identity.getAuthToken({interactive:false}, 
		function(current_token) {
			if(!chrome.runtime.lastError){
				chrome.identity.removeCachedAuthToken({token:current_token },
					function() {});
				var xhr = new XMLHttpRequest();
				xhr.open('GET', 'https://accounts.google.com/o/oauth2/revoke?token=' + current_token);
				xhr.send();
			}
	});
	pl_names = [];
}



document.addEventListener('DOMContentLoaded',function(){
	var button = document.getElementById('search');
	var sgnin = document.getElementById('sgnin');
	var sgnoutbtn = document.getElementById('sgnout');
	var div = document.getElementById('results');
	var input = document.getElementById('input');
	button.addEventListener('click',function(event){
		//var base_url = 'https://www.youtube.com/watch?v=';
		//var url = [];
		var result = input.value;
		getVideo(result);
	});
	input.addEventListener('keypress',function(e){
		var pressed = e.which || e.keyCode;
		if(pressed == 13){
			e.preventDefault();
			var result = input.value;
			getVideo(result);
		}
	})
	sgnin.addEventListener('click', function() {
		getUserInfo(true);
	});
	sgnoutbtn.addEventListener('click', function(event) {
		revokeToken();
	});
});
