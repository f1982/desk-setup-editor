import './App.scss';
import ThreeComponent from './component/ThreeContainer/ThreeComponent';
import React from 'react'

function App() {
  return (
    <div className="App">
      <ThreeComponent />
      <div className='tool-container'>
        <div className="left-bar">left bar</div>
        <div className="right"> right
        </div>
      </div>
      
    </div>
  );
}

export default App;
