require([
  'dojo/_base/lang',
  'dojo/dom',
  'dojo/on',

  'esri/geometry/Point',
  'esri/graphic',
  'esri/InfoTemplate',
  'esri/layers/GraphicsLayer',
  'esri/map',
  'esri/request',
  'esri/symbols/PictureMarkerSymbol',

  'dojo/domReady!'
],
  function(
  lang, dom, on,
  Point, Graphic, InfoTemplate, GraphicsLayer, Map, esriRequest, PictureMarkerSymbol
) {
    var addFlagGraphic = function(cityObj, width) {
      var height = width * 0.6;
      var point = new Point(cityObj.Lon, cityObj.Lat);
      var symbol = new PictureMarkerSymbol(cityObj.Image, width, height);

      var attr = {
        'City': cityObj.City,
        'State': cityObj.State,
        'Link': cityObj.Link,
        'Image': cityObj.Image
      };
      var infoTemplate = new InfoTemplate("${City}, ${State}", "<a href='${Link}' target='_blank'><img src='${Image}' /></a>");
      var graphic = new Graphic(point, symbol, attr, infoTemplate);
      graphicsLayer.add(graphic);
    };

    var zoomChangeHandler = function(evt, res) {
      graphicsLayer.clear();
      if (evt.level < 4) {
        res.forEach(function(item) {
          addFlagGraphic(item, 20);
        });
      } else if (evt.level < 5) {
        res.forEach(function(item) {
          addFlagGraphic(item, 30);
        });
      } else if (evt.level < 6) {
        res.forEach(function(item) {
          addFlagGraphic(item, 40);
        });
      } else if (evt.level < 7) {
        res.forEach(function(item) {
          addFlagGraphic(item, 50);
        });
      } else if (evt.level < 8) {
        res.forEach(function(item) {
          addFlagGraphic(item, 100);
        });
      } else {
        res.forEach(function(item) {
          addFlagGraphic(item, 150);
        });
      }
    };


    // Create the map
    var map = new Map("map", {
      basemap: "topo",
      center: [-100, 39.5],
      zoom: 4
    });


    var graphicsLayer = new GraphicsLayer({
      opacity: 0.80
    });
    map.addLayer(graphicsLayer);

    esriRequest({
      url: 'city-flags.js',
      'handleAs': 'json'
    }).then(function(res) {
      res.forEach(function(item) {
        addFlagGraphic(item, 22);
      });
      on(map, 'zoom-end', function(evt) {
        zoomChangeHandler(evt, res);
      });
    }.bind(this), function(err) {
      console.log("Error querying data.");
    });
  });