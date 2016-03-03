import dojoDeclare = require( "dojo/_base/declare");
import _WidgetBase = require( "dijit/_WidgetBase");
import _TemplatedMixin = require( "dijit/_TemplatedMixin");
import lang = require( 'dojo/_base/lang');
import dom = require( 'dojo/dom');
import on = require( 'dojo/on');
import Point = require('esri/geometry/Point');
import Graphic = require('esri/graphic');
import InfoTemplate = require('esri/InfoTemplate');
import GraphicsLayer = require('esri/layers/GraphicsLayer');
import Map = require('esri/map');
import esriRequest = require('esri/request');
import PictureMarkerSymbol = require('esri/symbols/PictureMarkerSymbol');


var MapView = dojoDeclare([_WidgetBase, _TemplatedMixin], {
  templateString: '<div class="map-container"></div>',
  // Widget LifeCycle
  postCreate: function() {
    this.inherited(arguments);
    // Create the map
    var map = new Map(this.domNode, {
      basemap: "topo",
      center: [-100, 39.5],
      zoom: 4
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
      res.forEach(lang.hitch(this, function(item) {
        this.addFlagGraphic(item, 22);
      }));
      on(map, 'zoom-end', lang.hitch(this, function(evt) {
        this.zoomChangeHandler(evt, res);
      }));
    }), function(err) {
      console.log("Error querying data.");
    });
  },
  addFlagGraphic: function(cityObj, width) {
    var height = width * 0.6;
    var point = new Point(cityObj.lon, cityObj.lat);
    var symbol = new PictureMarkerSymbol(cityObj.image, width, height);

    var attr = {
      'city': cityObj.city,
      'state': cityObj.state,
      'link': cityObj.link,
      'image': cityObj.image
    };
    var infoTemplate = new InfoTemplate("${city}, ${state}", "<a href='${link}' target='_blank'><img src='${image}' /></a>");
    var graphic = new Graphic(point, symbol, attr, infoTemplate);
    this.graphicsLayer.add(graphic);
  },
  zoomChangeHandler: function(evt, res) {
    this.graphicsLayer.clear();
    if (evt.level < 4) {
      res.forEach(lang.hitch(this, function(item) {
        this.addFlagGraphic(item, 20);
      }));
    } else if (evt.level < 5) {
      res.forEach(lang.hitch(this, function(item) {
        this.addFlagGraphic(item, 30);
      }));
    } else if (evt.level < 6) {
      res.forEach(lang.hitch(this, function(item) {
        this.addFlagGraphic(item, 40);
      }));
    } else if (evt.level < 7) {
      res.forEach(lang.hitch(this, function(item) {
        this.addFlagGraphic(item, 50);
      }));
    } else if (evt.level < 8) {
      res.forEach(lang.hitch(this, function(item) {
        this.addFlagGraphic(item, 100);
      }));
    } else {
      res.forEach(lang.hitch(this, function(item) {
        this.addFlagGraphic(item, 150);
      }));
    }
  }
});

export default MapView;