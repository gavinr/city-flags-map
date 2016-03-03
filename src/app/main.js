define(["require", "exports", 'app/MapView', "dojo/domReady!"], function (require, exports, MapView_1) {
    var node = document.getElementById('map');
    var mapView = new MapView_1.default(null, node);
});
