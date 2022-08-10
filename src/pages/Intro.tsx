import {Link} from 'react-router-dom'
import React from 'react'

function Intro() {
  return (
    <div className="App">
      <div className="intro">This is Setup Editor</div>
      <Link to="/editor">Editor</Link>
      <Link to="/about">About</Link>
    </div>
  );
}

export default Intro;
