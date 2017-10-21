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
        info: "hey",
        //icon: icon,
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
            getSmallestDistance();
            setUsers();
            //landmarks();
        }
    }
    request.send("login=S3hcFNS0&lat=" + myLat + "&lng=" + myLng);
}

function getSmallestDistance()
{    
    var min = Infinity;
    var lat, lng, loc, dist, idx, topLoc;
    for (i = 0; i < data.landmarks.length; ++i)
        {
            lng = data.landmarks[i].geometry.coordinates[0];
            lat = data.landmarks[i].geometry.coordinates[1];
            loc = new google.maps.LatLng(lat, lng);            
            dist = distance(me, loc);
            if (dist < min)
                {
                    min = dist;
                    idx = i;
                    topLoc = loc;
                }
        }
    
    marker.info = "Closest Landmark: " + data.landmarks[idx].properties.Location_Name;
    marker.info += "<br>" + "Distance from closest landmark : " + min + "miles";

    way = new google.maps.Polyline({
            path: [me, topLoc]
        });
    way.setMap(map);
}

function toRad(a){
    return a / 180 * Math.PI
}
function distance(a, b)
{
    var R = 6371e3; // metres
    var f1 = toRad(a.lat());
    var f2 = toRad(b.lat());
    var Df = toRad((b.lat()-a.lat()));
    var Dl = toRad((b.lng()-a.lng()));

    var a = Math.sin(Df/2) * Math.sin(Df/2) +
        Math.cos(f2) * Math.cos(f2) *
        Math.sin(Dl/2) * Math.sin(Dl/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function setUsers() {    
    for (i = 0; i < data.people.length; ++i) {
        latit = data.people[i].lat;
        longit = data.people[i].lng;
        var loc = new google.maps.LatLng(latit, longit);
        var dist = distance(loc, me);

        var user = new google.maps.Marker({
                position: location,
                title: "Others",
                info: "Login: " + data.people[i].login
                + "Distance from me: " + dist + " miles"
            });
        user.setMap(map);

        google.maps.event.addListener(user, 'click', function() {
                infoWindow.setContent(this.info);
                infoWindow.open(map, this);
            });
    }
}