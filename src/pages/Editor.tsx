import ThreeComponent from '../component/ThreeContainer/ThreeComponent';
import React from 'react'
import { Link } from 'react-router-dom';
import './Editor.scss'

function App() {
  return (
    <div className="App">
      <ThreeComponent />
      <div className='tool-container'>
        <div className="left-bar"></div>
        <div className="right"> <Link to="/">Home</Link></div>
      </div>
      
    </div>
  );
}

export default App;
