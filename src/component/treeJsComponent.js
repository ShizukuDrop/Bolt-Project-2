import React from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';
import * as d3 from 'd3';
import data from '../csv/short.csv';
import { resolve } from 'dns';
import mapboxgl from 'mapbox-gl';
import { zoom } from 'd3';
import { Scene } from 'three';

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

    //var scene = new THREE.Scene();
    //var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    

    //const canvas = document.getElementById("root")
    //var renderer = new THREE.WebGLRenderer();
    //renderer.setSize(window.innerWidth, window.innerHeight);
    //document.body.appendChild(renderer.domElement);

    //var controls = new THREE.OrbitControls(camera, renderer.domElement);

    
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
        zoom: 2,
        pitch: 80,
        //onAdd: function (map, gl) {
        //    this.camera = new THREE.Camera();
        //    this.scene = new THREE.Scene();
        //    this.renderer = new THREE.WebGLRenderer({
        //        canvas: map.getCanvas(),
        //        context: gl,
        //        antialias: true
        //    });
        //}
    });

    this.map.on('style.load', () => {
      readCSV().then(resolve => {
        lightning_points = resolve
        console.log(lightning_points)
      })

        this.map.addLayer(
            {
                'id': '3d-buildings',
                'source': 'composite',
                'source-layer': 'building',
                'filter': ['==', 'extrude', 'true'],
                'type': 'fill-extrusion',
                'minzoom': 5,
                'paint': {
                    'fill-extrusion-color': '#aaa',

                    // use an 'interpolate' expression to add a smooth transition effect to the
                    // buildings as the user zooms in
                    'fill-extrusion-height': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        15,
                        0,
                        15.05,
                        ['get', 'height']
                    ],
                    'fill-extrusion-base': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        15,
                        0,
                        15.05,
                        ['get', 'min_height']
                    ],
                    'fill-extrusion-opacity': 0.6
                }
            }
        );
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

        
        this.map.addLayer(
            {
                id: 'point',
                type: 'custom',

                onAdd: function (map, gl) {
                    // create GLSL source for vertex shader
                    var vertexSource =
                        '' +
                        'uniform mat4 u_matrix;' +
                        'attribute vec2 a_pos;' +
                        'void main() {' +
                        '    gl_Position = u_matrix * vec4(a_pos, 0.0, 1.0);' +
                        '}';

                    // create GLSL source for fragment shader
                    var fragmentSource =
                        '' +
                        'void main() {' +
                        '    gl_FragColor = vec4(1.0, 0.0, 0.0, 0.5);' +
                        '}';

                    // create a vertex shader
                    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
                    gl.shaderSource(vertexShader, vertexSource);
                    gl.compileShader(vertexShader);

                    // create a fragment shader
                    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
                    gl.shaderSource(fragmentShader, fragmentSource);
                    gl.compileShader(fragmentShader);

                    // link the two shaders into a WebGL program
                    this.program = gl.createProgram();
                    gl.attachShader(this.program, vertexShader);
                    gl.attachShader(this.program, fragmentShader);
                    gl.linkProgram(this.program);

                    this.aPos = gl.getAttribLocation(this.program, 'a_pos');

                    // define vertices of the triangle to be rendered in the custom style layer
                    var helsinki = mapboxgl.MercatorCoordinate.fromLngLat({
                        lng: 25.004,
                        lat: 60.239
                    });
                    var berlin = mapboxgl.MercatorCoordinate.fromLngLat({
                        lng: 13.403,
                        lat: 52.562
                    });
                    var kyiv = mapboxgl.MercatorCoordinate.fromLngLat({
                        lng: 30.498,
                        lat: 50.541
                    });

                    // create and initialize a WebGLBuffer to store vertex and color data
                    this.buffer = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
                    gl.bufferData(
                        gl.ARRAY_BUFFER,
                        new Float32Array([
                            helsinki.x,
                            helsinki.y,
                            berlin.x,
                            berlin.y,
                            kyiv.x,
                            kyiv.y
                        ]),
                        gl.STATIC_DRAW
                    );
                },

                render: function (gl, matrix) {
                    gl.useProgram(this.program);
                    gl.uniformMatrix4fv(
                        gl.getUniformLocation(this.program, 'u_matrix'),
                        false,
                        matrix
                    );
                    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
                    gl.enableVertexAttribArray(this.aPos);
                    gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 0, 0);
                    gl.enable(gl.BLEND);
                    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
                }
            }
            
        );
        
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
