import React from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';
import * as d3 from 'd3';
import data from '../csv/short.csv';
import { resolve } from 'dns';
import mapboxgl from 'mapbox-gl';
import { zoom } from 'd3';

mapboxgl.accessToken = 'pk.eyJ1IjoiamlhbndlaWlpIiwiYSI6ImNrNGpkd2xvYjFud2ozZXJ2Y2Jnd3ZhOXkifQ.UrrZ8h0t2Z_zHVfR3w1GPA';
let lightning_points;

function readCSV() {
    return new Promise(resolve => {
        var PromiseConstant = d3.csv(data, function (rows) {
            return rows
        });

        resolve(PromiseConstant);
    })
}

function TreeJsWindow() {
    readCSV().then(resolve => {
      console.log(resolve)
    })

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const canvas = document.getElementById("root")
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    
    return (
        <div>
            Window Above
        </div>
    );
}

// export default TreeJsWindow;
export default class Map extends React.Component {
  map;
  
  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: {lon: 135.02734, lat: 34.61682},
      zoom: 2
    });

    this.map.on('style.load', () => {
      readCSV().then(resolve => {
        lightning_points = resolve
        console.log(lightning_points)
      })
    })

    this.map.on('load', () => {
        console.log("map loaded")
        console.log(lightning_points)
        console.log(lightning_points[0]["Londitude"])

        // parameters to ensure the model is georeferenced correctly on the map
        var modelOrigin = [lightning_points[0]["Londitude"], lightning_points[0]["Latitude"]];
        var modelAltitude = lightning_points[0]["Height(m)"];
        var modelRotate = [Math.PI / 2, 0, 0];
        
        var modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
        modelOrigin,
        modelAltitude
        );
        console.log(modelAsMercatorCoordinate)

        // transformation parameters to position, rotate and scale the 3D model onto the map
        var modelTransform = {
          translateX: modelAsMercatorCoordinate.x,
          translateY: modelAsMercatorCoordinate.y,
          translateZ: modelAsMercatorCoordinate.z,
          rotateX: modelRotate[0],
          rotateY: modelRotate[1],
          rotateZ: modelRotate[2],
          /* Since our 3D model is in real world meters, a scale transform needs to be
          * applied since the CustomLayerInterface expects units in MercatorCoordinates.
          */
          scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
          };
        
      });

      
  }

  render() {
    const style = {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '100%'
    };

    return <div style={style} ref={el => this.mapContainer = el} />;
  }
}
