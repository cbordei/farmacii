google.maps.event.addDomListener(window, 'load', initMap);
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: zoom_level
  });    

  var marker = new google.maps.Marker({
    icon: user_icon,
    map: map
  });
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      marker.setPosition(pos);
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    map.setCenter({lat:"-7.238985",lng:"144.924088"})
    handleLocationError(false, map.getCenter());
  }

  // Get pharmacies and put them on the map
  google.maps.event.addListener(map, 'idle', function(){
      getCityName(map.getCenter().G, map.getCenter().K, function(data){
        city_name = data;
        if($.inArray(city_name, cities_loaded) < 0) {
          cities_loaded.push(city_name);
          $.ajax({
            url: places_url,
            type: "GET",
            dataType: "json",
            data: {'city_name': city_name},
            success: function(pharmacies) {
              for (var i = 0; i < pharmacies.length; i++) {
                pharmacy = pharmacies[i];
                if(typeof markers[pharmacy.id] === 'undefined'){
                  position = {lat: pharmacy.latitude, lng: pharmacy.longitude};                
                  addMarkerWithTimeout(pharmacy.id, position, (i+1)*300, map);
                }              
              }

            },          
          });
        }
      });
  });

}

function handleLocationError(browserHasGeolocation, pos) {
  var infoWindow = new google.maps.InfoWindow({map: map});
  infoWindow.setPosition(pos);
  if (browserHasGeolocation) {
    errorContent = 'Error: The Geolocation service failed.' ;
  } else {
    errorContent = 'Error: Your browser doesn\'t support geolocation.';
  }
  infoWindow.setContent();
}

function addMarkerWithTimeout(pharmacy_id, position, timeout, map) {
  window.setTimeout(function() {
    marker = new google.maps.Marker({
      position: position,
      map: map,
      animation: google.maps.Animation.DROP,
      icon: pharmacy_icon
    });
    markers[pharmacy_id] = marker;
  }, timeout);
}

function getCityName(lat, lng, callback) {
  var latlng = new google.maps.LatLng(lat, lng);
  geocoder = new google.maps.Geocoder();
  geocoder.geocode({'latLng': latlng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        for (var i=0; i<results[0].address_components.length; i++) {
          for (var b=0;b<results[0].address_components[i].types.length;b++) {
            if (results[0].address_components[i].types[b] == "locality") {
              city= results[0].address_components[i];
              break;
            }
          }
        }
        callback(city.short_name);
      } 
    } 
  });
}