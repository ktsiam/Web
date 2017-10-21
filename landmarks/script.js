var myLat = 0;
var myLng = 0;
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


function init() {
    console.log("init");
    getMyLocation();    
    map = new google.maps.Map(document.getElementById('map', myOptions));
    renderMap();
    console.log("map is created");
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
        alert("Geolocation is not supported by your web browser.");
        }
}    

function renderMap()
{
    me = new google.maps.LatLng(myLat, myLng);
    map.panTo(me);
    marker = new google.maps.Marker({
            position: me,
            title: "Here I Am!"
        });
    marker.setMap(map);
    
    google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(marker.title);
            infowindow.open(map, marker);
        });
}


