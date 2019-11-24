import React from 'react';
import * as THREE from 'three';
import * as d3 from 'd3';
import data from '../csv/short.csv';
import { resolve } from 'dns';

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


    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);


    return (
        <div>
            Window Above
        </div>
    );
}

export default TreeJsWindow;