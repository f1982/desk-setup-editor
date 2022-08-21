import ThreeComponent from '../../component/ThreeContainer/ThreeComponent';
import React from 'react'
import { Link } from 'react-router-dom';
import './Editor.scss'

const ToolBar = () => {
  return (
    <div className='tool-container'>
      <div className="left-bar"></div>
      <div className="right">
        <Link to="/">Home</Link>
      </div>
    </div>
  )
}

function EditorPage() {
  return (
    <div className="App">
      <ThreeComponent />
      <ToolBar />
    </div>
  );
}

export default EditorPage;
