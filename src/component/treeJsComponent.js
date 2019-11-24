import React from 'react';
import * as THREE from 'three';
import CSVReader from 'react-csv-reader'

function readCSV() {


    
}

function TreeJsWindow() {
    readCSV()


    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);


    return (
        <div>
            Window Above
        </div>
        <CSVReader onFileLoaded={data => console.log(data)} />
    );
}

export default TreeJsWindow;