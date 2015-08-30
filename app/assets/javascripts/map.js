google.maps.event.addDomListener(window, 'load', initMap);
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: zoom_level
  });    

  var user_marker = new google.maps.Marker({
    icon: user_icon,
    map: map
  });

  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    for(marker_index in markers) {
      if(!(typeof markers[marker_index] === 'undefined')) {
        markers[marker_index].setMap(null);        
        $("#pharmacies").html('');
      }
    }
    markers = {};

    var bounds = new google.maps.LatLngBounds();
    place = places[0];
    if (place.geometry.viewport) {
      // Only geocodes have viewport.
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }    
    map.fitBounds(bounds);
  });
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      user_marker.setPosition(pos);
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
      if(!(typeof city_name === 'undefined') && (city_name != data)) {
        // City changed - clear data
        for(marker_index in markers) {
          if(!(typeof markers[marker_index] === 'undefined')) {
            markers[marker_index].setMap(null);
            
            $("#pharmacies").html('');
          }
        }
        markers = {};
        // Remove the city from the cities array
        cities_loaded[$.inArray(city_name, cities_loaded)] = "";
      }
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
                first = i==0 ? true : false;                     
                addMarkerWithTimeout(pharmacy.id, position, (i+1)*200, map, first);
                addPharmacyToList(pharmacy, i);                 
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

function addMarkerWithTimeout(pharmacy_id, position, timeout, map, first) {
  window.setTimeout(function() {
    icon = first ? pharmacy_icon_big : pharmacy_icon;
    marker = new google.maps.Marker({
      position: position,
      map: map,
      animation: google.maps.Animation.DROP,
      icon: icon
    });
    markers[pharmacy_id] = marker;
    marker.addListener('click', function() {
      for(aux_marker in markers) {
        markers[aux_marker].setIcon(pharmacy_icon);
      }
      $(".list-group-item").removeClass("active");
      $("a[data-id='"+pharmacy_id+"']").addClass("active");
      this.setIcon(pharmacy_icon_big);
      var container = $('#scroll_area'),
      scrollTo = $("a[data-id='"+pharmacy_id+"']");
      container.animate({
          scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
      });
    });
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



function addPharmacyToList(pharmacy, index) {
  active = index == 0 ? 'active' : '';
  $("#pharmacies").append('<a data-id="'+pharmacy.id
    +'" href="/pharmacies/'+pharmacy.id
    +'" class="list-group-item '+active+'"><h4 class="list-group-item-heading">'
    +pharmacy.name+'</h4><p class="list-group-item-text">'
    +pharmacy.address+'</p></a>');
}