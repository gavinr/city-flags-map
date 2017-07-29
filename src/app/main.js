require([
  'app/MapView',
  'dojo/domReady!'
], function(MapView) {
  console.log('here');
  const node = document.getElementById('map');

  new MapView(null, node);
});