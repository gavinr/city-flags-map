define([
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',

  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/dom',
  'dojo/on',

  'esri/geometry/Point',
  'esri/Graphic',
  'esri/PopupTemplate',
  'esri/layers/GraphicsLayer',
  'esri/Map',
  'esri/request',
  'esri/symbols/PictureMarkerSymbol',
], function(
  _WidgetBase, _TemplatedMixin,
  declare,
  lang, dom, on,
  Point, Graphic, PopupTemplate, GraphicsLayer, Map, esriRequest, PictureMarkerSymbol
) {
  return declare([_WidgetBase, _TemplatedMixin], {
    templateString: '<div class="map-container"></div>',
    // Widget LifeCycle
    postCreate: () => {
      console.log('here');
      this.inherited(arguments);
      // Create the map
      const map = new Map(this.domNode, {
        basemap: 'topo',
        center: [0, 0]
      });

      this.set('map', map);

      this.graphicsLayer = new GraphicsLayer({
        opacity: 0.80
      });
      map.addLayer(this.graphicsLayer);

      esriRequest({
        url: 'city-flags.js',
        'handleAs': 'json'
      }).then(lang.hitch(this, function(res) {
        res.forEach((item) => {
          this.addFlagGraphic(item, 22);
        });
        on(map, 'zoom-end', (evt) => {
          this.zoomChangeHandler(evt, res);
        });
      }), () => {
        console.error('Error querying data.');
      });
    },
    addFlagGraphic: (cityObj, width) => {
      const height = width * 0.6;
      const point = new Point(cityObj.lon, cityObj.lat);
      const symbol = new PictureMarkerSymbol(cityObj.image, width, height);

      const attr = {
        'city': cityObj.city,
        'country': cityObj.country,
        'link': cityObj.link,
        'image': cityObj.image
      };
      const infoTemplate = new PopupTemplate('${city}, ${country}', '<a href="${link}" target="_blank"><img src="${image}" /></a>');
      const graphic = new Graphic(point, symbol, attr, infoTemplate);

      this.graphicsLayer.add(graphic);
    },
    zoomChangeHandler: (evt, res) => {
      this.graphicsLayer.clear();
      if (evt.level < 4) {
        res.forEach(lang.hitch(this, (item) => {
          this.addFlagGraphic(item, 20);
        }));
      } else if (evt.level < 5) {
        res.forEach(lang.hitch(this, (item) => {
          this.addFlagGraphic(item, 30);
        }));
      } else if (evt.level < 6) {
        res.forEach(lang.hitch(this, (item) => {
          this.addFlagGraphic(item, 40);
        }));
      } else if (evt.level < 7) {
        res.forEach(lang.hitch(this, (item) => {
          this.addFlagGraphic(item, 50);
        }));
      } else if (evt.level < 8) {
        res.forEach(lang.hitch(this, (item) => {
          this.addFlagGraphic(item, 100);
        }));
      } else {
        res.forEach(lang.hitch(this, (item) => {
          this.addFlagGraphic(item, 150);
        }));
      }
    }
  });
});