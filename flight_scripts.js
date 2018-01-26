var map = L.map('map').setView([0, 0], 2);

realtime = L.realtime(getCustomData, {
  interval: 10 * 1000,
  onEachFeature(f, l) {
    l.bindPopup(function() {
      var fieldNames = ["icao24", "callsign", "origin_country", "time_position", "last_contact", "longitude", "latitude", "geo_altitude", "on_ground", "velocity", "heading", "vertical_rate", "sensors", "baro_altitude", "squawk", "spi", "position_source"];
      var popupText = '<h3>' + f.properties[1] + ' Flight Information</h3><p>';
      $.each(f.properties, function(index) {
        popupText += '<strong>' + fieldNames[index] + '</strong> ' + f.properties[index] + '</br>';
      });
      return popupText;
    });
  }
}).addTo(map);

var CartoDB_PositronNoLabels = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

// Function Definitions
function getCustomData(success, error) {
  var url = "https://opensky-network.org/api/states/all";
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onload = function () {
    if (xhr.status === 200) {
      var res = convertToGeoJSON(xhr.responseText);
      success(res);
    } else {
      var e = new Error("HTTP Rquest")
        error(e, xhr.status);
    }
  };
  xhr.send();

  function convertToGeoJSON(input) {
    // Convert input to Object, if it is of type string
    if (typeof(input) == "string") {
      input = JSON.parse(input);
    }

    // Start building the GeoJSON string
    var fs = {
      "type": "FeatureCollection",
      "features": []
    };
    for (var i = 0; i < input.states.length && i < 10; i++) {
      var ele = input.states[i];
      var feature = {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [ele[5], ele[6]]
        }
      };
      feature.properties = ele;
      // Set the id
      feature.properties["id"] = i;

      // Check that the elements are numeric and only then insert
      if (isNumeric(ele[5]) && isNumeric(ele[6])) {
        // Add this feature to the features array
        fs.features.push(feature)
      }
    }
    //return the GeoJSON FeatureCollection
    return fs;
  }
  function isNumeric(x) {
    return !isNaN(parseFloat(x)) && isFinite(x);
  }

}
