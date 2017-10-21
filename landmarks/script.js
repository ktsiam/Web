var myLat = 42.4;
var myLng = -71.1;
var request = new XMLHttpRequest();
var me = new google.maps.LatLng(myLat, myLng);
var myOptions = {
	zoom: 13,
	center: me,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map;
var marker;
var infowindow = new google.maps.InfoWindow();

var icon = {
    url: "me.png",
    scaledSize: new google.maps.Size(50, 50), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
};

function map_init()
{
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	getMyLocation();
}

function getMyLocation() {
	if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			renderMap();
		});
	}
	else {
		alert("Geolocation is not supported by your web browser.  What a shame!");
	}
}

function renderMap()
{
	me = new google.maps.LatLng(myLat, myLng);
	map.panTo(me);
	
	marker = new google.maps.Marker({
		position: me,
		title: "That's me!",
        icon: icon,
	});
	marker.setMap(map);		   

    google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent("Hello there Traveller!");
		infowindow.open(map, marker);
        });

    makeRequest();
}

function makeRequest()
{
    request.open("POST", "https://defense-in-derpth.herokuapp.com/sendLocation", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
            console.log(data);
            getSmallestDistance();
        }
    }
    request.send("login=S3hcFNS0&lat=" + myLat + "&lng=" + myLng);
}

function getSmallestDistance()
{    
    google.maps.geometry.spherical.computeDistanceBetween(latLngA, latLngB);
}