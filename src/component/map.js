import React from 'react';
import * as THREE from 'three';
import * as d3 from 'd3';
import data from '../csv/short.csv';
import { resolve } from 'dns';
import mapboxgl from 'mapbox-gl';
import { ReactComponent } from '*.svg';
mapboxgl.accessToken = 'pk.eyJ1IjoiamlhbndlaWlpIiwiYSI6ImNrNGpkd2xvYjFud2ozZXJ2Y2Jnd3ZhOXkifQ.UrrZ8h0t2Z_zHVfR3w1GPA';

class Map extends React.Component {

}

function readCSV() {
    return new Promise(resolve => {
        var PromiseConstant = d3.csv(data, function (rows) {
            return rows
        });

        resolve(PromiseConstant);
    })
}

function TreeJsWindow() {
    readCSV().then(resolve => console.log(resolve))
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      // center: [this.state.lng, this.state.lat],
      // zoom: this.state.zoom
    });


    mapboxgl.accessToken = 'pk.eyJ1IjoiamlhbndlaWlpIiwiYSI6ImNrNGpkd2xvYjFud2ozZXJ2Y2Jnd3ZhOXkifQ.UrrZ8h0t2Z_zHVfR3w1GPA';
    // var map = new mapboxgl.Map({
    //   container: 'root',
    //   style: 'mapbox://styles/mapbox/streets-v11'
    // });

    // var scene = new THREE.Scene();
    // var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // var renderer = new THREE.WebGLRenderer();
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // document.body.appendChild(renderer.domElement);

    
    return (
        <div>
          <h1>
            Hello, {formatName(user)}!
          </h1>
            Window Above
        </div>
    );
}

function formatName(user) {
    return user.firstName + ' ' + user.lastName;
  }
  
  const user = {
    firstName: 'Harper',
    lastName: 'Perez'
  };
  

  // ReactDOM.render(
  //     element,
  //     document.getElementById('root'))

ReactDOM.render(<Map />, document.getElementById('root'));