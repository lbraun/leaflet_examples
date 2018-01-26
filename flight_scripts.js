var map = L.map('map').setView([0, 0], 2);

var CartoDB_PositronNoLabels = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

var url = "https://opensky-network.org/api/states/all";

$.getJSON(url, function(data) {
  $.each(data.states, function(index) {
    console.log(index)
    if (data.states[index] && data.states[index][6] && index < 10) {
      var marker = L.marker([data.states[index][6], data.states[index][5]]).addTo(map);
      marker.bindPopup(data.states[index][1]);
    }
  });
});
