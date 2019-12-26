import React from 'react';
import logo from './logo.svg';
import './App.css';

import SpeedBar from './component/speedbar';
import TreeJsWindow from './component/treeJsComponent';

function App() {
    return (
        <div>
                <TreeJsWindow></TreeJsWindow>
                <SpeedBar></SpeedBar>
                
        </div>
    );
}

export default App;
