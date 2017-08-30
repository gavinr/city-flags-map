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
  'esri/views/MapView',
  'esri/request',
  'esri/symbols/PictureMarkerSymbol',
], function(
  _WidgetBase, _TemplatedMixin,
  declare,
  lang, dom, on,
  Point, Graphic, PopupTemplate, GraphicsLayer, Map, MapView, esriRequest, PictureMarkerSymbol
) {
  return declare([_WidgetBase, _TemplatedMixin], {
    templateString: '<div class="map-container"></div>',
    // Widget LifeCycle
    postCreate() {
      // this.inherited(arguments);
      // Create the map
      this.map = new Map({
        basemap: 'topo',
      });

      this.view = new MapView({
        container: this.domNode,
        map: this.map,
        center: [0, 0]
      });

      // this.set('map', map);

      this.graphicsLayer = new GraphicsLayer({
        opacity: 0.80
      });
      this.map.layers.add(this.graphicsLayer);

      esriRequest('city-flags.js', {
        responseType: 'json'
      }).then((res) => {
        res.data.forEach((item) => {
          this.addFlagGraphic(item, 22);
        });
      }, () => {
        console.error('Error querying data.');
      });
    },
    addFlagGraphic(cityObj, width) {
      const height = width * 0.6;
      const point = new Point({longitude: cityObj.lon, latitude: cityObj.lat});
      const symbol = new PictureMarkerSymbol({url: cityObj.image, width, height});
      const attr = {
        'city': cityObj.city,
        'country': cityObj.country,
        'link': cityObj.link,
        'image': cityObj.image
      };
      const popupTemplate = new PopupTemplate({title: '{city}, {country}', content: '<a href="{link}" target="_blank"><img src="{image}" /></a>'});
      const graphic = new Graphic({geometry: point, attributes: attr, popupTemplate, symbol});

      this.graphicsLayer.add(graphic);
    },
    // zoomChangeHandler(evt, res) {
    //   console.log('zoomChangeHandler', evt, res);
    //   this.graphicsLayer.clear();
    //   if (evt.level < 4) {
    //     res.forEach(lang.hitch(this, (item) => {
    //       this.addFlagGraphic(item, 20);
    //     }));
    //   } else if (evt.level < 5) {
    //     res.forEach(lang.hitch(this, (item) => {
    //       this.addFlagGraphic(item, 30);
    //     }));
    //   } else if (evt.level < 6) {
    //     res.forEach(lang.hitch(this, (item) => {
    //       this.addFlagGraphic(item, 40);
    //     }));
    //   } else if (evt.level < 7) {
    //     res.forEach(lang.hitch(this, (item) => {
    //       this.addFlagGraphic(item, 50);
    //     }));
    //   } else if (evt.level < 8) {
    //     res.forEach(lang.hitch(this, (item) => {
    //       this.addFlagGraphic(item, 100);
    //     }));
    //   } else {
    //     res.forEach(lang.hitch(this, (item) => {
    //       this.addFlagGraphic(item, 150);
    //     }));
    //   }
    // }
  });
});