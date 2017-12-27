require([
  'app/MapView',
  'dojo/domReady!'
], function(MapView) {
  const node = document.getElementById('map');
  new MapView(null, node);
});