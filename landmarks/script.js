var myLat = 42.4;
var myLng = -71.1;
var request = new XMLHttpRequest();
var me = new google.maps.LatLng(myLat, myLng);
var myOptions = {
	zoom: 14,
	center: me,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map;
var marker;
var infowindow = new google.maps.InfoWindow();

var landMarkIcon = {
    url: "landmark.png",
    scaledSize: new google.maps.Size(25, 25),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(12, 12)
};

var myIcon = {
    url: "me.png",
    scaledSize: new google.maps.Size(60, 60),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(30, 60)
};

function map_init()
{
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	getMyLocation();
}

function getMyLocation() {
	if (navigator.geolocation) {
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
        icon: myIcon
	});
	marker.setMap(map);		   

    google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent("It's me!");
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
            setLandmarks();
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
    
    marker.info = "Closest Landmark: " + data.landmarks[idx].properties.Location_Name
        + "<br>" + "Distance from closest landmark : " + min + "miles";
    
    line = new google.maps.Polyline({
            path: [me, topLoc],
            //strokeColor: '#03f2e0'
        });
    line.setMap(map);
}

function toRad(a){
    return a / 180 * Math.PI
}
function distance(a, b)
{
    var R = 6371e3;
    var f1 = toRad(a.lat());
    var f2 = toRad(b.lat());
    var Df = toRad((b.lat()-a.lat()));
    var Dl = toRad((b.lng()-a.lng()));

    var a = Math.sin(Df/2) * Math.sin(Df/2) +
        Math.cos(f2) * Math.cos(f2) *
        Math.sin(Dl/2) * Math.sin(Dl/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    d = R * c;
    return (d / 1609.34).toFixed(3); //converting to miles
}

function setUsers() 
{
    for (i = 0; i < data.people.length; ++i) {
        latit = data.people[i].lat;
        longit = data.people[i].lng;
        var loc = new google.maps.LatLng(latit, longit);
        var dist = distance(loc, me);
        
        var user = new google.maps.Marker({
                position: loc,
                title: "Others",
                info: "Login: " + data.people[i].login
                + "</br>Distance from me: " + dist + " miles"
            });
        user.setMap(map); 
        displayInfo(user);
    }
}

function setLandmarks()
{
    for (i = 0; i < data.landmarks.length; ++i) {
        longitude = data.landmarks[i].geometry.coordinates[0];
        latitude = data.landmarks[i].geometry.coordinates[1];
        var location = new google.maps.LatLng(latitude, longitude);
        
        var landmarker = new google.maps.Marker({
                position: location,
                icon: landMarkIcon,
                title: "Landmark",
                info: data.landmarks[i].properties.Details
            });
        landmarker.setMap(map);
        displayInfo(landmarker);
    }
}


var infoWindow = new google.maps.InfoWindow();
function displayInfo(marker)
{
    google.maps.event.addListener(marker, 'click', function () {
            infoWindow.setContent(this.info);
            infoWindow.open(map, this);
        });
}

