require([
  'app/MapView',
  'dojo/domReady!'
], function(MapView) {
  var node = document.getElementById('map');
  var mapView = new MapView(null, node);
});