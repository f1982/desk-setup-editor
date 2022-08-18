import {Link} from 'react-router-dom'
import React from 'react'

function Intro() {
  return (
    <div className="page">
      <div className="intro">This is Setup Editor</div>
      <div>
        <Link to="/editor">Editor111</Link>
      </div>
      <div>
        <Link to="/about">About</Link> 
      </div>
    </div>
  );
}

export default Intro;
