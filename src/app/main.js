require([
  'app/MapView',
  'dojo/domReady!'
], function(MapView) {
  console.log('here2');
  const node = document.getElementById('map');

  new MapView(null, node);
});